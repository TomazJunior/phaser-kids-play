import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_TARGET, HIDDEN_THUMB_CHAR_MOVED_TO_NEXT } from '../events/events'
import { getAllSkins, getARandomSkinFrom } from '../utils/skinUtils'
import { FONTS, ANIMAL_SKINS, BUTTON, SOUNDS, SCENES } from '../utils/constants'
import ColoredText from '../ui/coloredText'
import HiddenThumbChars from '../objects/hiddenThumbChars'
import ScoreText from '../ui/scoreText'
import { GameMap } from '../objects/map'
import { ButtonSmall } from '../ui/buttonSmall'
import { LevelCompleteDialog } from '../ui/levelCompleteDialog'
import { getTutorialSeen, setLevel, setTutorialSeen } from '../utils/fileStorage'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { getGameWorld, getLevel, isLevelExist } from '../utils/worldUtil'

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
  levelText: ColoredText
  scoreText: ScoreText
  backgroundAudio: Phaser.Sound.BaseSound
  clickOnTargetAudio: Phaser.Sound.BaseSound
  gameMap: GameMap
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
    this.player = this.gameMap.createPlayer(this.handleReachedTarget)

    this.targets = this.physics.add.staticGroup()
    this.gameMap.createTargets(this.targets, this.handlePlayerGoToTarget)

    this.createBackButton()

    this.hiddenChars = this.add.group()
    this.hiddenThumbChars = new HiddenThumbChars(this, width * 0.5, height * 0)

    this.physics.add.collider(this.player, this.targets, undefined, undefined, this)
    // this.physics.add.collider(this.hiddenChars, this.targets, undefined, undefined, this)

    this.levelText = new ColoredText(
      this,
      width - 270,
      20,
      this.isInTutorialMode ? 'Tutorial' : `level ${this.level.level}`,
      {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      }
    )

    this.backgroundAudio = getOrAddAudio(this, SOUNDS.BACKGROUND, { volume: 0.4, loop: true })
    playSound(this, this.backgroundAudio)

    this.clickOnTargetAudio = getOrAddAudio(this, SOUNDS.CLICK_TARGET)

    this.scoreText = new ScoreText(this, width - 270, 70)

    this.createHiddenChars(this.level.hiddens)
    this.hiddenThumbChars.on(HIDDEN_THUMB_CHAR_MOVED_TO_NEXT, (data) => {
      if (!this.isInTutorialMode) return
      this.toggleHelpTarget(data?.previous, false)
      this.toggleHelpTarget(data?.current, true)
    })
  }

  private get isInTutorialMode(): boolean {
    return !getTutorialSeen(this.level.level)
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
    this.sound.resumeAll()
  }

  tryToFinishTutorialMode = () => {
    if (!this.shouldGoToNextLevel()) {
      return
    }
    setTutorialSeen(this.level.level, true)
    this.levelText.content = `level ${this.level.level}`
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
        finishedLevel ? '3 / 3' : `${stars} / 3`,
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
    return this.hiddenChars.getChildren().every((hiddenChar: any) => <HiddenChar>hiddenChar.visible)
  }

  nextLevel = async (): Promise<void> => {
    if (this.isInTutorialMode) {
      this.tryToFinishTutorialMode()
    }

    if (!this.shouldGoToNextLevel()) {
      this.player.active = true
      return Promise.resolve()
    }

    ++this.round
    if (this.round > this.level.rounds) {
      this.backgroundAudio.stop()
      setLevel({ level: this.level.level, stars: 3, key: this.currentWorld.key })
      this.showFinishGameDialog('You Win!', true, 3)
      return Promise.resolve()
    }

    this.time.delayedCall(500, () => {
      this.resetTargets()

      const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, { ...this.getInitialPlayerPosition() })
      this.player.setIsGoingTo(pathToGo, true)

      this.createHiddenChars(this.level.hiddens)
      this.player.active = true
    })
    return Promise.resolve()
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
    const { width, height } = this.scale
    this.time.delayedCall(delay, () => {
      const hiddenChar = new HiddenChar(this, width * 0.05, height * 0.1, hiddenSkin)
      hiddenChar.on(HIDDEN_CHAR_REACHED_TARGET, this.handleHiddenCharReachedTarget)
      this.hiddenChars.add(hiddenChar)
      hiddenChar.goTo(this.getFreeTarget())
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

  handlePlayerGoToTarget = (target: TargetInterface) => {
    if (!this.hiddenCharOnTheirPosition || target.opened) return

    const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, target.objectPosition, true)

    if (this.clickOnTargetAudio.isPlaying) this.clickOnTargetAudio.stop()
    playSound(this, this.clickOnTargetAudio)

    this.player.goTo(target, pathToGo)
  }

  handleHiddenCharReachedTarget = () => {
    if (this.hiddenCharsAreReady()) {
      this.time.delayedCall(500, () => {
        this.closeTargets()
        this.hiddenCharOnTheirPosition = true
        this.player.active = true

        const currentHiddenChar = this.hiddenThumbChars.getCurrentHiddenChar()
        if (currentHiddenChar) {
          this.toggleHelpTarget(currentHiddenChar, true)
        }
      })
    }
  }

  handleReachedTarget = (target: TargetInterface) => {
    this.time.delayedCall(100, () => {
      this.openTarget(target)
    })
  }

  toggleHelpTarget(hiddenChar: string, enable: boolean) {
    if (this.isInTutorialMode && hiddenChar) {
      const target: TargetInterface = <TargetInterface>this.targets.children.getArray().find((target: any) => {
        return (<TargetInterface>target).hiddenCharName === hiddenChar
      })
      if (target) {
        target.toggleHelp(enable)
      }
    }
  }

  openTarget = async (target: TargetInterface) => {
    this.player.active = false
    const currentHiddenChar = this.hiddenThumbChars.getCurrentHiddenChar()

    if (!target.hiddenCharName || !target.isRightTarget(currentHiddenChar)) {
      target.wrongTarget()
      this.closeTarget(target)
      if (!this.isInTutorialMode) {
        // TODO: move to constants/util
        let stars = 0
        if (this.round === 5) {
          stars = 3
        } else if (this.round > 3) {
          stars = 2
        } else if (this.round > 1) {
          stars = 1
        }

        await this.showMissedHidden()

        setLevel({ level: this.level.level, stars, key: this.currentWorld.key })
        this.showFinishGameDialog('Game over', false, stars)
      }
      return
    }

    target.openTarget(true)
    this.scoreText.incScore()
    this.hiddenThumbChars.moveToNext(target.hiddenCharName)

    const hiddenChar: HiddenChar = this.getHiddenChar(target.hiddenCharName)
    if (!hiddenChar) return
    this.tweens.add({
      targets: hiddenChar,
      y: '-=50',
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: async () => {
        hiddenChar.visible = true
        await this.nextLevel()
      },
    })
  }

  showMissedHidden = async (): Promise<void> => {
    const delay = 500
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
