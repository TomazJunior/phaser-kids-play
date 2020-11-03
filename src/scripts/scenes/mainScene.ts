import HiddenChar from '../objects/hiddenChar'
import {
  HIDDEN_CHARS_ENQUEUED,
  HIDDEN_CHAR_REACHED_FINAL_POS,
  HIDDEN_CHAR_REACHED_TARGET,
  PLAYER_REACHED_FINAL_POS,
  PLAYER_REACHED_INITIAL_POS,
} from '../events/events'
import { getAllSkins, getARandomSkinFrom } from '../utils/skinUtils'
import { ANIMAL_SKINS, BUTTON, SOUNDS, SCENES } from '../utils/constants'
import HiddenThumbChars from '../objects/hiddenThumbChars'
import ScoreText from '../ui/scoreText'
import { GameMap } from '../objects/map'
import { ButtonSmall } from '../ui/buttonSmall'
import { LevelCompleteDialog } from '../ui/levelCompleteDialog'
import { getTutorialSeen, setLevel, setTutorialSeen } from '../utils/fileStorage'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { getGameWorld, getLevel, isLevelExist } from '../utils/worldUtil'
import { FrameLevel } from '../ui/frameLevel'
import { calculateStars } from '../utils/starsUtil'
import { TargetQueue } from '../controllers/targetQueue'
import Door from '../objects/door'
import { FrameDialog } from '../ui/frameDialog'

export default class MainScene extends Phaser.Scene {
  targets: Phaser.Physics.Arcade.StaticGroup
  player: PlayerInterface
  hiddenChars: Phaser.GameObjects.Group
  hiddenThumbChars: HiddenThumbChars
  currentHiddenSkins: ANIMAL_SKINS[]
  availableHiddenSkins: ANIMAL_SKINS[]
  gameover = false
  currentWorld: GameWorld
  level: Level
  round: number
  hiddenCharOnTheirPosition = false
  scoreText: ScoreText
  backgroundAudio: Phaser.Sound.BaseSound
  gameMap: GameMap
  frameLevel: FrameLevel
  targetQueue: TargetQueue
  roundInProgress: boolean
  door: Door
  constructor() {
    super({ key: SCENES.MAIN_SCENE })
  }

  init(config: MainSceneConfig) {
    this.gameover = false
    if (!config.gameWorld?.key) {
      this.currentWorld = getGameWorld()
    } else {
      this.currentWorld = { ...config.gameWorld }
    }

    if (!config.level?.level) {
      this.level = getLevel(this.currentWorld.levels, 1)
    } else {
      this.level = { ...config.level }
    }
    this.round = 1
    this.currentHiddenSkins = []
    this.availableHiddenSkins = []
    this.hiddenCharOnTheirPosition = false
  }

  create() {
    this.sound.pauseOnBlur = false
    this.game.events.on(Phaser.Core.Events.BLUR, () => {
      this.handleLoseFocus()
    })
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        return
      }
      this.handleLoseFocus()
    })

    const { width, height } = this.scale

    this.createBackground()
    this.gameMap = new GameMap(this, 0, 0, this.currentWorld)

    this.targets = this.physics.add.staticGroup()

    this.createBackButton()

    this.hiddenChars = this.add.group()
    this.hiddenThumbChars = new HiddenThumbChars(this, width * 0.5, height * 0)

    this.frameLevel = new FrameLevel(
      this,
      width - 200,
      90,
      this.isInTutorialMode ? 'Tutorial' : `Level ${this.level.level}`,
      0,
      this.handleLoseFocus
    )
    this.backgroundAudio = getOrAddAudio(this, SOUNDS.BACKGROUND, { volume: 0.4, loop: true })
    playSound(this, this.backgroundAudio)

    this.createHiddenChars(this.level.hiddens)

    this.targetQueue = new TargetQueue(this, this.level, this.gameMap.createTargets(this.targets), [
      ...this.currentHiddenSkins,
    ])
    if (!this.events.eventNames().includes(HIDDEN_CHARS_ENQUEUED)) {
      this.events.on(HIDDEN_CHARS_ENQUEUED, this.goToNextHiddenChar, this)
    }

    this.player = this.gameMap.createPlayer(this.handleReachedTarget)
    this.player.on(PLAYER_REACHED_INITIAL_POS, this.handlePlayerReachedInitialPosition)
    this.player.on(PLAYER_REACHED_FINAL_POS, this.handlePlayerReachedFinalPosition)

    this.physics.add.collider(this.player, this.targets, undefined, undefined, this)
    this.physics.add.collider(this.hiddenChars, this.targets, undefined, undefined, this)

    this.door = this.createDoor()
  }

  private get isInTutorialMode(): boolean {
    return !!this.level.tutorial && !getTutorialSeen(this.level.level)
  }

  handleLoseFocus = () => {
    // if (1 === 1) return
    // assuming a Paused scene that has a pause modal
    if (this.scene.isActive(SCENES.PAUSE_SCENE)) {
      return
    }

    // show Paused scene only if Main scene is active
    if (!this.scene.isActive(SCENES.MAIN_SCENE)) {
      return
    }

    // stop all sounds and main scene
    this.scene.pause(SCENES.MAIN_SCENE)
    this.sound.pauseAll()

    this.scene.run(SCENES.PAUSE_SCENE, <PauseSceneConfig>{
      onResume: this.resumePausedScene,
      onHome: () => {
        this.resumePausedScene()
        this.goToMenuScene()
      },
      onRestart: () => {
        this.resumePausedScene()
        this.restartScene(this.level)
      },
    })
  }

  restartScene = (level: Level) => {
    this.setToGameOverState(() => {
      this.scene.restart(<MainSceneConfig>{
        gameWorld: this.currentWorld,
        level,
      })
    })
  }

  resumePausedScene = () => {
    this.scene.stop(SCENES.PAUSE_SCENE)
    this.scene.resume(SCENES.MAIN_SCENE)
    playSound(this, getOrAddAudio(this, SOUNDS.BACKGROUND))
  }

  tryToFinishTutorialMode = () => {
    if (!this.shouldGoToNextLevel()) {
      return
    }
    setTutorialSeen(this.level.level, true)
    this.frameLevel.title = `Level ${this.level.level}`
  }

  showFinishGameDialog = (text: string, finishedLevel: boolean, stars: number) => {
    const { width, height } = this.scale
    const restartButtonConfig: ButtonConfig = {
      name: BUTTON.RESTART,
      onClick: () => {
        this.restartScene(this.level)
      },
    }
    const currentLevel = { ...this.level }
    const nextLevelExists = isLevelExist(this.currentWorld.levels, currentLevel.level + 1)

    const nextLevelButtonConfig: ButtonConfig = {
      name: BUTTON.RIGHT,
      onClick: () => {
        if (nextLevelExists) {
          this.restartScene(getLevel(this.currentWorld.levels, currentLevel.level + 1))
        }
      },
    }
    const levelSceneButtonConfig: ButtonConfig = {
      name: BUTTON.LEVEL,
      onClick: () => {
        this.goToLevelScene()
      },
    }

    let secondButtonConfig: ButtonConfig
    let thirdButtonConfig: ButtonConfig

    if (finishedLevel) {
      secondButtonConfig = nextLevelExists ? levelSceneButtonConfig : { ...levelSceneButtonConfig, visible: false }
      thirdButtonConfig = nextLevelExists ? nextLevelButtonConfig : levelSceneButtonConfig
    } else {
      secondButtonConfig = this.round > 1 ? restartButtonConfig : levelSceneButtonConfig
      thirdButtonConfig = this.round > 1 ? nextLevelButtonConfig : restartButtonConfig
    }

    this.setToGameOverState(() => {
      new LevelCompleteDialog(
        this,
        width * 0.5,
        height * 0.5,
        text,
        this.frameLevel.starsFormated,
        finishedLevel,
        {
          name: BUTTON.HOME,
          onClick: this.goToMenuScene,
        },
        secondButtonConfig,
        thirdButtonConfig
      )
    })
  }

  update() {
    if (this.gameover) return
  }

  createBackground() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)
  }

  createBackButton() {
    new ButtonSmall(this, 10, 10, {
      onClick: () => {
        this.goToLevelScene()
      },
      name: BUTTON.LEFT,
    }).setOrigin(0, 0)
  }

  goToMenuScene = () => {
    this.setToGameOverState(() => {
      this.scene.stop(SCENES.MAIN_SCENE)
      this.backgroundAudio.stop()
      this.scene.start(SCENES.MENU_SCENE)
    })
  }

  goToLevelScene() {
    this.setToGameOverState(() => {
      this.backgroundAudio.stop()
      this.scene.start(SCENES.LEVEL_SCENE)
    })
  }

  setToGameOverState(cb: () => void) {
    this.time.delayedCall(300, () => {
      if (!this.gameover) {
        this.round = 0
        this.gameover = true
        this.player.active = false
        this.player.visible = false
        this.clearHiddenChars()
        this.closeTargets()
        this.backgroundAudio.stop()
      }
      cb()
    })
  }

  hiddenCharsAreReady(): boolean {
    return (
      this.currentHiddenSkins.length === this.hiddenChars.getLength() &&
      this.hiddenChars.getChildren().every((hiddenChar: any) => <HiddenChar>hiddenChar.reachedTarget)
    )
  }

  shouldGoToNextLevel(): boolean {
    return (
      this.targetQueue.isEmpty &&
      this.hiddenChars.getChildren().every((hiddenChar: any) => <HiddenChar>hiddenChar.visible)
    )
  }

  nextLevel = async (): Promise<void> => {
    if (this.isInTutorialMode) {
      this.tryToFinishTutorialMode()
    }

    if (!this.shouldGoToNextLevel()) {
      this.goToNextHiddenChar()
      return Promise.resolve()
    }
    this.roundInProgress = false
    this.frameLevel.stars = calculateStars(this.round)
    // it will go to next round when reach the final position
    this.playerGotoFinalPosition()
    return Promise.resolve()
  }

  handlePlayerReachedInitialPosition = () => {
    const { height, width } = this.scale
    this.targetQueue.clear()
    this.targetQueue.inTutorialMode = this.isInTutorialMode
    this.isInTutorialMode &&
      this.level.tutorial &&
      new FrameDialog(this, width * 0.5, height * 0.5, this.level.tutorial.text)
  }

  handleHiddenReachedFinalPosition = (hiddenChar: HiddenChar) => {
    hiddenChar.goToDoor(this.door.objectPosition)
    this.time.delayedCall(600, () => {
      this.handlePlayerReachedFinalPosition()
    })
  }

  handlePlayerReachedFinalPosition = () => {
    this.door.open = true
    if (this.hiddenCharsAreReady() && !this.roundInProgress) {
      this.roundInProgress = true

      ++this.round
      if (this.round > this.level.rounds) {
        this.backgroundAudio.stop()
        setLevel({ level: this.level.level, stars: 3, key: this.currentWorld.key })
        this.showFinishGameDialog('You Win!', true, 3)
        return Promise.resolve()
      }

      this.time.delayedCall(1000, () => {
        this.resetTargets()
        this.door.open = false
        this.createHiddenChars(this.level.hiddens)
        this.player.active = true
      })
    }
  }

  resetTargets() {
    this.targets.getChildren().forEach((target: any) => (<TargetInterface>target).reset())
  }

  closeTargets() {
    this.targets.getChildren().forEach((target: any) => {
      ;(<TargetInterface>target).close()
    })
  }

  clearHiddenChars() {
    this.availableHiddenSkins = getAllSkins()
    this.hiddenCharOnTheirPosition = false
    this.currentHiddenSkins = []

    this.hiddenChars.getChildren().forEach((hiddenChar) => (hiddenChar.active = false))
    this.hiddenChars.clear(true, true)
    this.hiddenThumbChars.clear()
  }

  createDoor() {
    return new Door(
      this,
      this.currentWorld.tileConfig,
      this.gameMap.getDoorMidPosition(),
      this.gameMap.getDoorTopPosition()
    )
  }

  createHiddenChars(numberOfHiddens: number) {
    this.clearHiddenChars()

    for (let index = 0; index < numberOfHiddens; index++) {
      const hiddenSkin = getARandomSkinFrom(this.availableHiddenSkins)
      this.currentHiddenSkins.push(hiddenSkin)
      this.createHiddenChar(hiddenSkin, 1000 * (index + 1))
    }
    this.hiddenThumbChars.createChars(this.currentHiddenSkins)
  }

  createHiddenChar(hiddenSkin: ANIMAL_SKINS | null, delay: number) {
    const initialPosition = this.gameMap.getTilePosition(7, 1)

    this.time.delayedCall(delay, () => {
      const hiddenChar = new HiddenChar(this, initialPosition, this.gameMap, hiddenSkin)
      hiddenChar.once(HIDDEN_CHAR_REACHED_TARGET, this.handleHiddenCharReachedTarget)
      hiddenChar.once(HIDDEN_CHAR_REACHED_FINAL_POS, this.handleHiddenReachedFinalPosition)

      this.hiddenChars.add(hiddenChar)

      const target = this.getFreeTarget()
      const pathToGo = this.gameMap.getPathTo(initialPosition, target.objectPosition, false)

      hiddenChar.goTo(target, pathToGo)
    })
  }

  getFreeTarget(): TargetInterface {
    const availTargets = this.getFreeTargets()
    const randomTargetPos = Math.floor(Math.random() * availTargets.length)
    return availTargets[this.isInTutorialMode ? 0 : randomTargetPos]
  }

  getFreeTargets(): TargetInterface[] {
    return <TargetInterface[]>(
      this.targets.getChildren().filter((target: any) => !(<TargetInterface>target.hiddenCharName))
    )
  }

  getHiddenChar(skin: string): HiddenChar {
    return <HiddenChar>this.hiddenChars.getChildren().find((p: any) => {
      return p.skin === skin
    })
  }

  getInitialPlayerPosition(): ObjectPosition {
    return this.gameMap.getPlayerPosition()
  }

  goToNextHiddenChar = () => {
    const target = this.targetQueue.dequeue()
    if (target) {
      this.player.active = true
      const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, target.objectPosition, true)
      this.player.goTo(target, pathToGo)
    }
  }

  handleHiddenCharReachedTarget = () => {
    if (this.hiddenCharsAreReady()) {
      this.time.delayedCall(500, () => {
        this.closeTargets()
        this.hiddenCharOnTheirPosition = true
        // go to initial position only on the first round
        if (this.round === 1) {
          this.playerGotoInitialPosition()
        }
        if (this.player.isReady) {
          this.targetQueue.clear()
          this.targetQueue.inTutorialMode = this.isInTutorialMode
        }
      })
    }
  }

  playerGotoInitialPosition = () => {
    this.player.setVisible(true)
    this.player.active = true
    const playerInitialPosition = this.gameMap.getPlayerInitPosition()
    const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, playerInitialPosition, true)
    this.player.goToPath(playerInitialPosition, pathToGo)
  }

  playerGotoFinalPosition = () => {
    this.player.setVisible(true)
    this.player.active = true
    const playerFinalPosition = this.gameMap.getPlayerFinalPosition()
    const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, playerFinalPosition, true)
    this.player.goToPath(playerFinalPosition, pathToGo)
  }

  handleReachedTarget = (target: TargetInterface) => {
    this.time.delayedCall(100, () => {
      this.openTarget(target)
    })
  }

  openTarget = async (target: TargetInterface) => {
    this.player.active = false
    if (!target.hiddenCharName || !target.isRightTarget(this.hiddenThumbChars.currentHiddenChar)) {
      target.wrongTarget()
      this.closeTarget(target)
      if (!this.isInTutorialMode) {
        await this.showMissedHidden()
        const stars = calculateStars(this.round)
        setLevel({ level: this.level.level, stars, key: this.currentWorld.key })
        this.showFinishGameDialog('Game over', false, stars)
      }
      return
    }

    target.openTarget(true)
    this.hiddenThumbChars.moveToNext(target.hiddenCharName)

    const hiddenChar: HiddenChar = this.getHiddenChar(target.hiddenCharName)
    if (!hiddenChar) return

    this.player.pushHiddenChar(hiddenChar, this.targetQueue.getNext(), async () => {
      await this.nextLevel()
    })
  }

  showMissedHidden = async (): Promise<void> => {
    const delay = 1000
    return new Promise((resolve, reject) => {
      const missedHiddenChars: Array<ANIMAL_SKINS> = this.hiddenThumbChars.getHiddenChars(true)
      const totalDelay = delay + delay * missedHiddenChars.length
      missedHiddenChars.forEach((hiddenCharName: ANIMAL_SKINS, index: number) => {
        this.time.delayedCall(delay * index, () => {
          const hiddenChar: HiddenChar = this.getHiddenChar(hiddenCharName)
          this.tweens.add({
            targets: hiddenChar,
            y: '-=50',
            alpha: 1,
            scale: 1,
            duration: 500,
            onComplete: async () => {
              hiddenChar.visible = true
              this.time.delayedCall(totalDelay - delay * index, () => {
                hiddenChar.visible = false
              })
            },
          })
        })
      })
      this.time.delayedCall(totalDelay, () => {
        resolve()
      })
    })
  }

  closeTarget = (target: TargetInterface) => {
    if (!target) return
    this.time.delayedCall(1000, () => {
      target.close()
      this.player.active = true
    })
  }
}
