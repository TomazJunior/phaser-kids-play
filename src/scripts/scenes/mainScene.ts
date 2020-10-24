import Player from '../objects/player'
import Box from '../objects/box'
import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_BOX, PLAYER_CHAR_REACHED_BOX, PLAYER_TOUCHED_BOX } from '../events/events'
import { getAllSkins, getARandomSkinFrom } from '../utils/skinUtils'
import { FONTS, LEVELS, ANIMAL_SKINS, TILES, BUTTON, SOUNDS } from '../utils/constants'
import ColoredText from '../ui/coloredText'
import HiddenThumbChars from '../objects/hiddenThumbChars'
import ScoreText from '../ui/scoreText'
import { GameMap } from '../objects/map'
import { ButtonSmall } from '../ui/buttonSmall'
import { LevelCompleteDialog } from '../ui/levelCompleteDialog'
import { getFileStorageConfig, setLevel, setTutorialMode } from '../utils/fileStorage'
import { getOrAddAudio, playSound } from '../utils/audioUtil'

const INIT_Y = 37

export default class MainScene extends Phaser.Scene {
  boxes: Phaser.Physics.Arcade.StaticGroup
  player: Player
  hiddenChars: Phaser.GameObjects.Group
  hiddenThumbChars: HiddenThumbChars
  activeBox: Box
  currentHiddenSkins: ANIMAL_SKINS[]
  availableHiddenSkins: ANIMAL_SKINS[]
  gameover = false
  level: Level
  round: number
  hiddenCharOnTheirPosition = false
  levelText: ColoredText
  scoreText: ScoreText
  backgroundAudio: Phaser.Sound.BaseSound
  clickOnBoxAudio: Phaser.Sound.BaseSound
  gameMap: GameMap
  constructor() {
    super({ key: 'MainScene' })
  }

  init(currentLevel: Level) {
    this.gameover = false
    if (!currentLevel?.level) {
      this.level = this.getLevel(1)
    } else {
      this.level = { ...currentLevel }
    }
    this.round = 1
    this.currentHiddenSkins = []
    this.availableHiddenSkins = []
    this.hiddenCharOnTheirPosition = false
  }

  handleLoseFocus = () => {
    // assuming a Paused scene that has a pause modal
    if (this.scene.isActive('PauseScene')) {
      return
    }

    // show Paused scene only if Main scene is active
    if (!this.scene.isActive('MainScene')) {
      return
    }

    // stop all sounds and main scene
    this.scene.pause('MainScene')
    this.sound.pauseAll()

    this.scene.run('PauseScene', <PauseSceneConfig>{
      onResume: this.resumePausedScene,
      onHome: () => {
        this.resumePausedScene()
        this.goToMenuScene()
      },
      onRestart: () => {
        this.resumePausedScene()
        this.restartScene()
      },
    })
  }

  restartScene = (level?: Level) => {
    this.setToGameOverState(() => {
      this.scene.restart(level)
    })
  }

  resumePausedScene = () => {
    this.scene.stop('PauseScene')
    this.scene.resume('MainScene')
    this.sound.resumeAll()
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

    this.gameMap = new GameMap(this, 0, 0)

    const playerPosition = this.gameMap.getTilesPosition([TILES.PLAYER])[0]
    this.player = new Player(this, playerPosition)
    this.player.on(PLAYER_CHAR_REACHED_BOX, this.handleReachedBox)

    this.boxes = this.physics.add.staticGroup()
    const boxesPosition = this.gameMap.getTilesPosition([TILES.BOX])
    boxesPosition.forEach((pos) => {
      new Box(this, pos, this.boxes).on(PLAYER_TOUCHED_BOX, this.handlePlayerGoToBox)
    })

    this.createBackButton()

    this.hiddenChars = this.add.group()
    this.hiddenThumbChars = new HiddenThumbChars(this, width * 0.5, height * 0)
    this.physics.add.collider(this.player, this.boxes, undefined, undefined, this)
    this.physics.add.collider(this.hiddenChars, this.boxes, undefined, undefined, this)

    this.levelText = new ColoredText(
      this,
      width - 270,
      20,
      this.tutorialMode ? 'Tutorial' : `level ${this.level.level}`,
      {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      }
    )

    this.backgroundAudio = getOrAddAudio(this, SOUNDS.BACKGROUND, { volume: 0.4, loop: true })
    playSound(this, this.backgroundAudio)

    this.clickOnBoxAudio = getOrAddAudio(this, SOUNDS.CLICK_BOX)

    this.scoreText = new ScoreText(this, width - 270, 70)

    this.createHiddenChars(this.level.hiddens)
    this.startTutorialMode()
  }

  private get tutorialMode(): boolean {
    return getFileStorageConfig().tutorialMode
  }

  startTutorialMode = () => {
    if (!this.tutorialMode) return null
    const firstBox: Box = <Box>this.boxes.children.getArray()[0]
    firstBox.toggleHelp()
  }

  finishTutorialMode = () => {
    const firstBox: Box = <Box>this.boxes.children.getArray()[0]
    firstBox.toggleHelp()
    setTutorialMode(false)
    this.levelText.content = `level ${this.level.level}`
  }

  showFinishGameDialog = (text: string, finishedLevel: boolean) => {
    const { width, height } = this.scale
    const restartButtonConfig: ButtonConfig = {
      name: BUTTON.RESTART,
      onClick: () => {
        this.restartScene()
      },
    }
    const currentLevel = { ...this.level }
    const nextLevelExists = this.isLevelExist(currentLevel.level + 1)

    const nextLevelButtonConfig: ButtonConfig = {
      name: BUTTON.RIGHT,
      onClick: () => {
        if (nextLevelExists) {
          this.restartScene(this.getLevel(currentLevel.level + 1))
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
        this.scoreText.text,
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
      this.scene.stop('MainScene')
      this.backgroundAudio.stop()
      this.scene.start('MenuScene')
    })
  }

  goToLevelScene() {
    this.setToGameOverState(() => {
      this.backgroundAudio.stop()
      this.scene.start('LevelScene')
    })
  }

  setToGameOverState(cb: () => void) {
    this.time.delayedCall(300, () => {
      if (!this.gameover) {
        this.gameover = true
        this.player.active = false
        this.player.visible = false
        this.clearHiddenChars()
        this.closeBoxes()
        this.backgroundAudio.stop()
      }
      cb()
    })
  }

  hiddenCharsAreReady(): boolean {
    return (
      this.currentHiddenSkins.length === this.hiddenChars.getLength() &&
      this.hiddenChars.getChildren().every((x: any) => x.reachedBox)
    )
  }

  shouldGoToNextLevel(): boolean {
    return this.hiddenChars.getChildren().every((x: any) => x.visible)
  }

  nextLevel = async (): Promise<void> => {
    if (this.tutorialMode) {
      this.finishTutorialMode()
    }

    if (!this.shouldGoToNextLevel()) {
      this.player.active = true
      return Promise.resolve()
    }

    ++this.round
    if (this.round > this.level.rounds) {
      this.backgroundAudio.stop()
      setLevel({ level: this.level.level, stars: 3 })
      this.showFinishGameDialog('You Win!', true)
      return Promise.resolve()
    }

    this.time.delayedCall(500, () => {
      this.resetBoxes()

      const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, { ...this.getInitialPlayerPosition() })
      this.player.setIsGoingTo(pathToGo, true)

      this.createHiddenChars(this.level.hiddens)
      this.player.active = true
    })
    return Promise.resolve()
  }

  isLevelExist(level: number): boolean {
    return LEVELS.find((levelConfig) => level === levelConfig.level) !== undefined
  }

  getLevel(level: number): Level {
    const levelFound = LEVELS.find((levelConfig) => level === levelConfig.level)
    if (!levelFound) throw new Error(`level ${level} not found`)
    return levelFound
  }

  resetBoxes() {
    this.boxes.getChildren().forEach((box: any) => box.reset())
  }

  closeBoxes() {
    this.boxes.getChildren().forEach((box: any) => {
      box.close()
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
      hiddenChar.on(HIDDEN_CHAR_REACHED_BOX, this.handleHiddenCharReachedBox)
      this.hiddenChars.add(hiddenChar)
      hiddenChar.goTo(this.getFreeBox())
    })
  }

  getFreeBox(): Box {
    const availBoxes = this.getFreeBoxes()
    const randomBoxPos = Math.floor(Math.random() * availBoxes.length)
    return availBoxes[this.tutorialMode ? 0 : randomBoxPos]
  }

  getFreeBoxes(): Box[] {
    return <Box[]>this.boxes.getChildren().filter((box: any) => !box.hiddenCharName)
  }

  getHiddenChar(skin: string): HiddenChar {
    return <HiddenChar>this.hiddenChars.getChildren().find((p: any) => {
      return p.skin === skin
    })
  }

  getInitialPlayerPosition(): ObjectPosition {
    return this.gameMap.getTilesPosition([TILES.PLAYER])[0]
  }

  handlePlayerGoToBox = (box: Box) => {
    if (!this.hiddenCharOnTheirPosition || box.opened) return

    const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, box.objectPosition)

    if (this.clickOnBoxAudio.isPlaying) this.clickOnBoxAudio.stop()
    playSound(this, this.clickOnBoxAudio)

    this.player.goTo(box, pathToGo)
  }

  handleHiddenCharReachedBox = () => {
    if (this.hiddenCharsAreReady()) {
      this.time.delayedCall(500, () => {
        this.closeBoxes()
        this.hiddenCharOnTheirPosition = true
        this.player.active = true
      })
    }
  }

  handleReachedBox = (box: Box) => {
    this.time.delayedCall(100, () => {
      this.openBox(box)
    })
  }

  openBox = (box: Box) => {
    this.player.active = false
    const currentHiddenChar = this.hiddenThumbChars.getCurrentHiddenChar()

    if (!box.hiddenCharName || !box.isRightBox(currentHiddenChar)) {
      box.wrongBox()
      this.closeBox(box)
      //TODO: move to constants/util
      let stars = 0
      if (this.round === 5) {
        stars = 3
      } else if (this.round > 3) {
        stars = 2
      } else if (this.round > 1) {
        stars = 1
      }

      setLevel({ level: this.level.level, stars })
      this.showFinishGameDialog('Game over', false)
      return
    }

    box.openBox()
    this.scoreText.incScore()
    this.hiddenThumbChars.moveToNext(box.hiddenCharName)

    const hiddenChar: HiddenChar = this.getHiddenChar(box.hiddenCharName)
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

  closeBox = (box: Box) => {
    if (!box) return
    this.time.delayedCall(1000, () => {
      box.close()
      this.player.active = true
    })
  }
}
