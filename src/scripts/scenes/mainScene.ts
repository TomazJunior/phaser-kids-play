import Player from '../objects/player'
import Box from '../objects/box'
import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_BOX, PLAYER_CHAR_REACHED_BOX, PLAYER_TOUCHED_BOX } from '../events/events'
import { getAllSkins, getARandomSkinFrom } from '../utils/skinUtils'
import { FONTS, LEVELS, MAP, ANIMAL_SKINS, SPRITE_NAME, BOX, TILES } from '../utils/constants'
import { ModalDialog } from '../utils/modalDialog'
import ColoredText from '../ui/coloredText'
import BigLevelText from '../ui/bigLevelText'
import { Button } from '../ui/button'
import HiddenThumbChars from '../objects/hiddenThumbChars'
import ScoreText from '../ui/scoreText'
import { GameMap } from '../objects/map'

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
  level = 1
  hiddenCharOnTheirPosition = false
  levelText: ColoredText
  bigLevelText: BigLevelText
  scoreText: ScoreText
  backgroundAudio: Phaser.Sound.BaseSound
  clickOnBoxAudio: Phaser.Sound.BaseSound
  gameMap: GameMap
  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.gameover = false
    this.level = 1
    this.currentHiddenSkins = []
    this.availableHiddenSkins = []
    this.hiddenCharOnTheirPosition = false
  }

  create() {
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

    this.levelText = new ColoredText(this, width - 270, 20, this.tutorialMode ? 'Tutorial' : `level ${this.level}`, {
      fontFamily: FONTS.ALLOY_INK,
      fontSize: '48px',
    })

    this.backgroundAudio =
      this.sound.get('background-sound') || this.sound.add('background-sound', { volume: 0.4, loop: true })
    this.backgroundAudio.play()

    this.clickOnBoxAudio = this.sound.get('click-box') || this.sound.add('click-box')

    this.scoreText = new ScoreText(this, width - 270, 70)

    this.bigLevelText = new BigLevelText(this, width * 0.5, height * 0.5, this.levelText.content, {
      fontFamily: FONTS.ALLOY_INK,
      fontSize: '132px',
    })

    const selectedLevel = this.getCurrentLevel()
    this.createHiddenChars(selectedLevel ? selectedLevel.hiddens : 1)
    this.startTutorialMode()
  }

  private get tutorialMode(): boolean {
    return this.getFileStorageConfig().tutorialMode
  }

  private set tutorialMode(v: boolean) {
    this.setFileStorageConfig({
      ...this.getFileStorageConfig(),
      tutorialMode: v,
    })
  }

  getFileStorageConfig = (): FileStorageConfig => {
    const value: any = localStorage.getItem('fileStorage')
    if (!!value) {
      return JSON.parse(value)
    }
    return {
      tutorialMode: true,
    }
  }

  setFileStorageConfig = (fileStorage: FileStorageConfig) => {
    localStorage.setItem('fileStorage', JSON.stringify(fileStorage))
  }

  startTutorialMode = () => {
    if (!this.tutorialMode) return null
    const firstBox: Box = <Box>this.boxes.children.getArray()[0]
    firstBox.toggleHelp()
  }

  finishTutorialMode = () => {
    const firstBox: Box = <Box>this.boxes.children.getArray()[0]
    firstBox.toggleHelp()
    this.tutorialMode = false
  }

  showFinishGameDialog = (text: string, color: string) => {
    new ModalDialog(this, {
      buttonConfigs: [
        {
          icon: SPRITE_NAME.WHITE_SHEET,
          iconFrame: 'return.png',
          text: 'Restart',
          onClick: () => {
            this.scene.restart()
          },
        },
      ],
      content: {
        x: 0,
        y: -50,
        text,
        color,
        fontSize: '96px',
      },
      subContent: {
        x: 0,
        y: 10,
        text: `Score: ${this.scoreText.text}`,
        color: 'blue',
        fontSize: '48px',
      },
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
    new Button(this, 10, 10, {
      icon: SPRITE_NAME.WHITE_SHEET,
      iconFrame: 'left.png',
      onClick: () => {
        this.backgroundAudio.stop()
        this.scene.start('MenuScene')
      },
    })
  }

  setToGameOverState() {
    if (this.gameover) return
    this.gameover = true
    this.player.active = false
    this.player.visible = false
    this.clearHiddenChars()
    this.backgroundAudio.stop()
  }

  hiddenCharsAreReady(): boolean {
    return (
      this.currentHiddenSkins.length === this.hiddenChars.getLength() &&
      this.hiddenChars.getChildren().every((x: any) => x.reachedBox)
    )
  }

  goToNextLevel(): boolean {
    return this.hiddenChars.getChildren().every((x: any) => x.visible)
  }

  nextLevel = async (): Promise<void> => {
    if (this.tutorialMode) {
      this.finishTutorialMode()
    }

    if (!this.goToNextLevel()) {
      this.player.active = true
      return Promise.resolve()
    }

    ++this.level
    const selectedLevel = this.getCurrentLevel()
    if (!selectedLevel) {
      this.backgroundAudio.stop()
      this.showFinishGameDialog('You Win!', 'green')
      return Promise.resolve()
    }
    this.levelText.content = `level ${selectedLevel.level}`
    await this.bigLevelText.updateContent(this.levelText.content)

    this.time.delayedCall(500, () => {
      this.resetBoxes()

      const pathToGo = this.gameMap.getPathTo(this.player.objectPosition, { ...this.getInitialPlayerPosition() })
      this.player.setIsGoingTo(pathToGo, true)

      this.createHiddenChars(selectedLevel.hiddens)
      this.player.active = true
    })
    return Promise.resolve()
  }

  getCurrentLevel() {
    return LEVELS.find((levelConfig) => this.level >= levelConfig.from && this.level <= levelConfig.to)
  }

  resetBoxes() {
    this.boxes.getChildren().forEach((box: any) => box.reset())
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
    this.clickOnBoxAudio.play()

    this.player.goTo(box, pathToGo)
  }

  handleHiddenCharReachedBox = () => {
    if (this.hiddenCharsAreReady()) {
      this.boxes
        .getChildren()
        .filter((box: any) => !box.hiddenCharName)
        .forEach((box: any) => {
          box.close()
        })
      this.hiddenCharOnTheirPosition = true
      this.player.active = true
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
      this.showFinishGameDialog('Game over', 'red')
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
