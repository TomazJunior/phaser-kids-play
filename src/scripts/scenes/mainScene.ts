import HiddenChar from '../objects/hiddenChar'
import {
  ALL_SKILL_ITEMS_CURRENT_STATE_DONE,
  HIDDEN_CHARS_ENQUEUED,
  HIDDEN_CHAR_REACHED_FINAL_POS,
  HIDDEN_CHAR_REACHED_TARGET,
  PLAYER_REACHED_FINAL_POS,
  PLAYER_REACHED_INITIAL_POS,
  removeKnownEvents,
} from '../events/events'
import { getAllSkins, getARandomSkinFrom } from '../utils/skinUtils'
import { ANIMAL_SKINS, BUTTON, SOUNDS, SCENES, MAIN_SCENE_STATE } from '../utils/constants'
import HiddenThumbChars from '../objects/hiddenThumbChars'
import { GameMap } from '../controllers/gameMap'
import { ButtonSmall } from '../ui/buttonSmall'
import { LevelCompleteDialog } from '../ui/levelCompleteDialog'
import { getTutorialSeen, setTutorialSeen } from '../utils/fileStorage'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { getGameWorld, getLevel } from '../utils/worldUtil'
import { FrameLevel } from '../ui/frameLevel'
import { TargetQueue } from '../controllers/targetQueue'
import Door from '../objects/door'
import { FrameDialog } from '../ui/frameDialog'
import FingerPoint from '../objects/fingerPoint'
import { Timer } from '../controllers/timer'
import SkillItem from '../objects/skillItems/skillItem'
import { SkillItemList } from '../objects/skillItemList'
import { StateController } from '../controllers/stateController'

export default class MainScene extends Phaser.Scene {
  targets: Array<TargetInterface>
  targetGroup: Phaser.Physics.Arcade.StaticGroup
  player: PlayerInterface
  hiddenChars: Phaser.GameObjects.Group
  hiddenThumbChars: HiddenThumbChars
  currentHiddenSkins: ANIMAL_SKINS[]
  availableHiddenSkins: ANIMAL_SKINS[]
  gameover = false
  currentWorld: GameWorld
  level: Level
  hiddenCharOnTheirPosition = false
  backgroundAudio: Phaser.Sound.BaseSound
  gameMap: GameMap
  frameLevel: FrameLevel
  targetQueue: TargetQueue
  roundInProgress: boolean
  door: Door
  timer: Timer
  skillItemsConfig: SkillItemFileStorageConfig[]
  _round: number
  constructor() {
    super({ key: SCENES.MAIN_SCENE })
  }

  private set round(v: number) {
    this._round = v
    if (this.frameLevel) this.frameLevel.round = v
  }

  private get round(): number {
    return this._round
  }

  init(config: MainSceneConfig) {
    removeKnownEvents(this)
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

    this.skillItemsConfig = [...config.skillItems]
    this.round = 1
    this.currentHiddenSkins = []
    this.availableHiddenSkins = []
    this.hiddenCharOnTheirPosition = false
    StateController.getInstance().changeState(MAIN_SCENE_STATE.INIT)
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
    this.gameMap.overrideTiles(this.level)

    this.targetGroup = this.physics.add.staticGroup()

    this.createBackButton()

    this.hiddenChars = this.add.group()
    this.hiddenThumbChars = new HiddenThumbChars(this, width * 0.5, height * 0)

    StateController.getInstance().skillItems = this.getSkillItems()

    this.frameLevel = new FrameLevel(
      this,
      width - 200,
      170,
      this.currentWorld.name,
      this.isInTutorialMode ? 'Tutorial' : `Level ${this.level.level}`,
      this.handleLoseFocus
    )
    this.backgroundAudio = getOrAddAudio(this, SOUNDS.BACKGROUND, { volume: 0.4, loop: true })
    playSound(this, this.backgroundAudio)
    this.door = this.createDoor()

    this.targets = this.gameMap.createTargets(this.targetGroup)

    StateController.getInstance().changeState(MAIN_SCENE_STATE.STARTED)
    this.updateSkillItemStatuses(this.afterStart)
  }

  // TODO: move to state controller
  // It will need a big refactoring to make StateController
  // as the owner of the state
  private updateSkillItemStatuses = (callback: () => void) => {
    const { currentState } = StateController.getInstance()

    if (!StateController.getInstance().getSkillItemsOfCurrentState().length) {
      callback()
      return
    }

    if (currentState === MAIN_SCENE_STATE.STARTED) {
      const skillItemFrameDialog = new FrameDialog(
        this,
        this.frameLevel.x,
        this.frameLevel.y + this.frameLevel.displayHeight,
        ['Great news!', 'You have an item to be', 'used now!', 'Or just close this dialog.'],
        true,
        {
          width: this.frameLevel.displayWidth,
          height: this.frameLevel.displayHeight,
        },
        () => {
          // Remove listener to avoid accumulate events
          this.events.off(ALL_SKILL_ITEMS_CURRENT_STATE_DONE)
          callback()
        }
      )
      this.events.once(ALL_SKILL_ITEMS_CURRENT_STATE_DONE, () => {
        skillItemFrameDialog.close()
      })
    } else {
      callback()
    }
  }

  private afterStart = () => {
    this.createHiddenChars(this.level)
    this.targetQueue = new TargetQueue(this, this.level, this.targets, [...this.currentHiddenSkins])
    if (!this.events.eventNames().includes(HIDDEN_CHARS_ENQUEUED)) {
      this.events.on(HIDDEN_CHARS_ENQUEUED, this.goToNextHiddenChar, this)
    }

    this.player = this.gameMap.createPlayer(this.handleReachedTarget)
    this.player.on(PLAYER_REACHED_INITIAL_POS, this.handlePlayerReachedInitialPosition)
    this.player.on(PLAYER_REACHED_FINAL_POS, this.handlePlayerReachedFinalPosition)

    this.physics.add.collider(this.player, this.targetGroup, undefined, undefined, this)

    this.timer = new Timer(this, (seconds: number) => {
      this.frameLevel.timer = seconds
    })
  }

  private get isInTutorialMode(): boolean {
    return !!this.level.tutorial && !getTutorialSeen(this.currentWorld, this.level.level)
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
        this.restartScene(this.currentWorld, this.level)
      },
    })
  }

  getSkillItems = (): Array<SkillItem> => {
    return this.skillItemsConfig
      .map((s) => {
        return SkillItemList.getSkillItemBySkill(s.skin)
      })
      .filter((s) => !!s?.clazz)
      .map((s) => new s!.clazz(this))
  }

  restartScene = (gameWorld: GameWorld, level: Level) => {
    this.setToGameOverState(() => {
      this.scene.stop(SCENES.MAIN_SCENE)
      this.backgroundAudio.stop()
      this.scene.start(SCENES.SELECT_ITEMS_SCENE, <CurrentWorldAndLevelConfig>{
        gameWorld,
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
    setTutorialSeen(this.currentWorld.key, this.level.level, true)
    this.frameLevel.levelName = this.currentWorld.name
    this.frameLevel.levelName = `Level ${this.level.level}`
  }

  showFinishGameDialog = () => {
    const { width, height } = this.scale
    this.setToGameOverState(() => {
      new LevelCompleteDialog(
        this,
        width * 0.5,
        height * 0.5,
        this.currentWorld,
        this.level,
        this.frameLevel.timers,
        this.round - 1,
        this.restartScene,
        this.goToLevelScene
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
    new ButtonSmall(this, 50, 50, {
      onClick: () => {
        this.goToLevelScene()
      },
      name: BUTTON.LEFT,
    }).setOrigin(0.5, 0.5)
  }

  goToMenuScene = () => {
    this.setToGameOverState(() => {
      this.scene.stop(SCENES.MAIN_SCENE)
      this.backgroundAudio.stop()
      this.scene.start(SCENES.MENU_SCENE)
    })
  }

  goToLevelScene = () => {
    this.setToGameOverState(() => {
      this.backgroundAudio.stop()
      this.scene.start(SCENES.LEVEL_SCENE)
    })
  }

  setToGameOverState = (cb: () => void) => {
    StateController.getInstance().changeState(MAIN_SCENE_STATE.GAME_OVER)
    this.time.delayedCall(300, () => {
      if (!this.gameover) {
        this.gameover = true
        if (this.player) {
          this.player.active = false
          this.player.visible = false
        }
        this.clearHiddenChars()
        this.closeTargets()
        this.backgroundAudio.stop()
        this.timer?.stop()
      }
      cb()
    })
  }

  addHiddenChar(hiddenChar: HiddenChar) {
    this.hiddenChars.add(hiddenChar)
    if (this.hiddenCharsReachedTargets()) {
      StateController.getInstance().changeState(MAIN_SCENE_STATE.HIDDEN_CHAR_IN_SCENE)
    }
  }

  hiddenCharsReachedTargets(): boolean {
    return this.currentHiddenSkins.length === this.hiddenChars.getLength()
  }

  hiddenCharsReachedTheDoor(): boolean {
    return (
      this.hiddenCharsReachedTargets() &&
      this.hiddenChars.getChildren().every((hiddenChar: any) => {
        return <HiddenChar>hiddenChar.enteredTheDoor
      })
    )
  }

  hiddenCharsAreReady(): boolean {
    return (
      this.hiddenCharsReachedTargets() &&
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
    this.gameMap.overrideTiles(this.level)
    this.roundInProgress = false
    // it will go to next round when reach the final position
    this.playerGotoFinalPosition()
    return Promise.resolve()
  }

  handlePlayerReachedInitialPosition = () => {
    const { height, width } = this.scale

    if (this.isInTutorialMode && this.level.tutorial) {
      StateController.getInstance().changeState(MAIN_SCENE_STATE.IN_TUTORIAL)
      let fingerPointer: FingerPoint
      if (this.level.tutorial.showPointer) {
        const { row, col } = this.level.tutorial.showPointer
        const { x, y } = this.gameMap.getTilePosition(row, col)
        fingerPointer = new FingerPoint(this, x + this.currentWorld.tileConfig.height * 0.5, y)
        fingerPointer.setVisible(true)
      }
      new FrameDialog(this, width * 0.5, height * 0.5, this.level.tutorial.text, false, undefined, () => {
        fingerPointer?.destroy()
        this.startRound()
      })
    } else {
      this.startRound()
    }
  }

  handleHiddenReachedFinalPosition = async (hiddenChar: HiddenChar) => {
    await hiddenChar.goToDoor(this.door)

    if (hiddenChar.followingPlayer) {
      if (this.hiddenCharsReachedTheDoor()) {
        StateController.getInstance().changeState(MAIN_SCENE_STATE.HIDDEN_CHAR_IN_THER_DOOR)
      }
      this.time.delayedCall(600, () => {
        this.handlePlayerReachedFinalPosition()
      })
    }
  }

  handlePlayerReachedFinalPosition = () => {
    this.door.open = true
    if (this.hiddenCharsAreReady() && !this.roundInProgress) {
      StateController.getInstance().changeState(MAIN_SCENE_STATE.STARTED)

      this.roundInProgress = true
      ++this.round
      if (this.round > this.level.rounds) {
        this.backgroundAudio.stop()
        this.showFinishGameDialog()
        return Promise.resolve()
      }

      this.time.delayedCall(1000, () => {
        this.resetTargets()
        this.door.open = false
        this.frameLevel.timer = 0
        this.updateSkillItemStatuses(this.prepareCharsToNextRound)
      })
    }
  }

  prepareCharsToNextRound = () => {
    this.createHiddenChars(this.level)
    this.player.active = true
  }

  resetTargets() {
    this.targetGroup.getChildren().forEach((target: any) => (<TargetInterface>target).reset())
  }

  closeTargets() {
    this.targetGroup.getChildren().forEach((target: any) => {
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

  createHiddenChars(level: Level) {
    //TODO: show dialog to choose skill items from STARTED scene if exists
    // console.log('show dialog STARTED scene')

    const { hiddens, extraHiddens } = level
    const extraSkins: Array<ANIMAL_SKINS> = []
    this.clearHiddenChars()

    if (extraHiddens) {
      for (let index = 0; index < extraHiddens; index++) {
        const hiddenSkin = getARandomSkinFrom(this.availableHiddenSkins)
        extraSkins.push(hiddenSkin)
      }
    }

    for (let index = 0; index < hiddens; index++) {
      const hiddenSkin = getARandomSkinFrom(this.availableHiddenSkins)
      this.currentHiddenSkins.push(hiddenSkin)
    }

    let index = 0
    this.currentHiddenSkins.forEach((hiddenSkin) => {
      this.createHiddenChar(hiddenSkin, 1000 * ++index)
      if (extraSkins.length && Math.random() >= 0.5) {
        const extraSkin = extraSkins.shift()
        if (extraSkin) {
          this.createExtraHiddenChar(extraSkin, 1000 * ++index, extraSkins.indexOf(hiddenSkin) % 2 === 0)
        }
      }
    })

    // add remeaning extra skins
    extraSkins.forEach((extraSkin) => {
      this.createExtraHiddenChar(extraSkin, 1000 * ++index, extraSkins.indexOf(extraSkin) % 2 === 0)
    })

    this.hiddenThumbChars.createChars(this.currentHiddenSkins)
  }

  createExtraHiddenChar(hiddenSkin: ANIMAL_SKINS, delay: number, useLongPath: boolean) {
    const initialPosition = this.gameMap.getTilePosition(7, 1)
    const intermediatePosition = this.gameMap.getIntermediatePosition()
    const finalPosition = this.gameMap.getPlayerFinalPosition()

    this.time.delayedCall(delay, () => {
      const hiddenChar = new HiddenChar(this, initialPosition, this.gameMap, hiddenSkin)
      hiddenChar.once(HIDDEN_CHAR_REACHED_FINAL_POS, this.handleHiddenReachedFinalPosition)
      let pathToGo: Array<ObjectPosition> = []
      if (useLongPath) {
        pathToGo = [
          ...this.gameMap.getPathTo(initialPosition, intermediatePosition, false),
          ...this.gameMap.getPathTo(intermediatePosition, finalPosition, false),
        ]
      } else {
        pathToGo = [...this.gameMap.getPathTo(initialPosition, finalPosition, false)]
      }
      hiddenChar.goToPath(finalPosition, pathToGo)
    })
  }

  createHiddenChar(hiddenSkin: ANIMAL_SKINS, delay: number) {
    const initialPosition = this.gameMap.getTilePosition(7, 1)

    this.time.delayedCall(delay, () => {
      const hiddenChar = new HiddenChar(this, initialPosition, this.gameMap, hiddenSkin)
      hiddenChar.once(HIDDEN_CHAR_REACHED_TARGET, this.handleHiddenCharReachedTarget)
      hiddenChar.once(HIDDEN_CHAR_REACHED_FINAL_POS, this.handleHiddenReachedFinalPosition)

      this.addHiddenChar(hiddenChar)

      const target = this.getRandomFreeTarget()
      const pathToGo = this.gameMap.getPathTo(initialPosition, target.objectPosition, false)

      hiddenChar.goTo(target, pathToGo)
    })
  }

  getRandomFreeTarget(): TargetInterface {
    const availTargets = this.getFreeTargets()
    const randomTargetPos = Math.floor(Math.random() * availTargets.length)
    return availTargets[this.isInTutorialMode ? 0 : randomTargetPos]
  }

  getFreeTargets(): TargetInterface[] {
    return <TargetInterface[]>this.targetGroup.getChildren().filter((item: any) => {
      const target = <TargetInterface>item
      return !target.stuck && !target.hiddenCharName
    })
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
      StateController.getInstance().changeState(MAIN_SCENE_STATE.TARGETS_ENQUEUED)
      this.timer.stop()
      this.player.active = true
      const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, target.objectPosition, true)
      this.player.goTo(target, pathToGo)
    }
    if (this.targetQueue.isEmpty) {
      this.frameLevel.addTimer(this.timer.seconds)
    }
  }

  // after player is reqdy and all hiddens are on their targets
  startRound() {
    StateController.getInstance().changeState(MAIN_SCENE_STATE.PLAYER_READY)
    this.targetQueue.clear()
    this.targetQueue.inTutorialMode = this.isInTutorialMode
    this.timer.start()
  }

  handleHiddenCharReachedTarget = () => {
    if (this.hiddenCharsAreReady()) {
      this.time.delayedCall(500, () => {
        this.closeTargets()
        this.hiddenCharOnTheirPosition = true
        StateController.getInstance().changeState(MAIN_SCENE_STATE.HIDDEN_CHAR_IN_TARGET)
        // go to initial position only on the first round
        if (this.round === 1) {
          this.playerGotoInitialPosition()
        }
        if (this.player.isReady) {
          this.startRound()
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
        this.showFinishGameDialog()
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
