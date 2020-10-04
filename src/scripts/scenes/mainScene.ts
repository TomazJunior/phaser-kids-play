import Player from '../objects/player'
import Box from '../objects/box'
import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_BOX, PLAYER_CHAR_REACHED_BOX, PLAYER_TOUCHED_BOX } from '../events/events'
import { getAllSkins, getARandomSkinFrom, getRandomSkin } from '../utils/skinUtils'
import { LEVELS, SKINS, SPRITE_NAME } from '../utils/constants'
import { ModalDialog } from '../utils/modalDialog'

export default class MainScene extends Phaser.Scene {
  boxes: Phaser.Physics.Arcade.StaticGroup
  player: Player
  hiddenChars: Phaser.GameObjects.Group
  hiddenThumbChars: Phaser.GameObjects.Group
  activeBox: Box
  currentHiddenSkins: SKINS[]
  availableHiddenSkins: SKINS[]
  gameover = false
  level = 1
  hiddenCharOnTheirPosition = false
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
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    const initialPos = this.getInitialPlayerPosition()
    this.player = new Player(this, initialPos.x, initialPos.y)
    this.player.on(PLAYER_CHAR_REACHED_BOX, this.handleReachedBox)

    this.createBoxes()
    this.hiddenChars = this.add.group()
    this.hiddenThumbChars = this.add.group()
    this.physics.add.collider(this.player, this.boxes, undefined, undefined, this)
    this.physics.add.collider(this.hiddenChars, this.boxes, undefined, undefined, this)

    this.availableHiddenSkins = getAllSkins()
    this.createHiddenChars(this.level)
  }

  showFinishGameDialog = () => {
    const { width, height } = this.scale
    const modalDialog = new ModalDialog(this)
    modalDialog.create({
      width,
      height,
      content: 'You Win!',
      labels: [
        { content: 'Home', icon: 'previous' },
        { content: 'Restart', icon: 'refresh' },
      ],
    })

    modalDialog.show((groupName: string, index: number) => {
      if (this.gameover) return
      this.gameover = true
      this.player.active = false
      this.player.visible = false
      this.clearHiddenChars()

      this.time.delayedCall(200, () => {
        if (index === 0) {
          // go home
          this.scene.start('MenuScene')
        } else if (index === 1) {
          // restart game
          this.scene.restart()
        }
      })
    })
  }

  update() {
    if (this.gameover) return
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

  nextLevel = () => {
    if (!this.goToNextLevel()) {
      this.player.active = true
      return
    }

    ++this.level
    const selectedLevel = LEVELS.find((levelConfig) => this.level >= levelConfig.from && this.level <= levelConfig.to)
    if (!selectedLevel) {
      this.showFinishGameDialog()
      return
    }

    this.time.delayedCall(300, () => {
      this.resetBoxes()

      this.player.setIsGoingTo({ ...this.getInitialPlayerPosition(), initialPos: true })
      this.createHiddenChars(selectedLevel.hiddens)
      this.player.active = true
    })
  }

  resetBoxes() {
    this.boxes.getChildren().forEach((box: any) => box.reset())
  }

  clearHiddenChars() {
    this.hiddenCharOnTheirPosition = false
    this.currentHiddenSkins = []

    this.hiddenChars.getChildren().forEach((hiddenChar) => (hiddenChar.active = false))
    this.hiddenChars.clear(true, true)
    this.hiddenThumbChars.clear(true, true)
  }

  createHiddenChars(numberOfHiddens: number) {
    const { width, height } = this.scale
    this.clearHiddenChars()

    for (let index = 0; index < numberOfHiddens; index++) {
      const hiddenSkin = getARandomSkinFrom(this.availableHiddenSkins)
      this.currentHiddenSkins.push(hiddenSkin)
      this.hiddenThumbChars.add(
        this.add
          .sprite(width * 0.5 + 80 * index, 40, SPRITE_NAME.ROUND_ANIMALS, hiddenSkin)
          .setOrigin(0.5)
          .setScale(0.5)
      )
      this.createHiddenChar(hiddenSkin, 1000 * (index + 1))
    }
  }

  createHiddenChar(hiddenSkin: string, delay: number) {
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
    return availBoxes[randomBoxPos]
  }

  getFreeBoxes(): Box[] {
    return <Box[]>this.boxes.getChildren().filter((box: any) => !box.hiddenCharName)
  }

  getHiddenChar(skin: string): HiddenChar {
    return <HiddenChar>this.hiddenChars.getChildren().find((p: any) => {
      return p.skin === skin
    })
  }

  getInitialPlayerPosition(): { x: number; y: number } {
    const { width, height } = this.scale

    return {
      x: width * 0.1,
      y: height * 0.9,
    }
  }

  createBoxes = () => {
    this.boxes = this.physics.add.staticGroup()
    const { width } = this.scale
    let xPer = 0.25
    let y = 210
    let id = 0
    const rows = 3
    const cols = 3

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const box = new Box(this, width * xPer, y, this.boxes, ++id)
        box.on(PLAYER_TOUCHED_BOX, this.handlePlayerGoToBox)
        xPer += 0.25
      }
      xPer = 0.25
      y += 250
    }
  }

  handlePlayerGoToBox = (box: Box) => {
    if (!this.hiddenCharOnTheirPosition || box.opened) return
    this.player.goTo(box)
  }

  handleHiddenCharReachedBox = () => {
    if (this.hiddenCharsAreReady()) {
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
    if (!box.hiddenCharName) {
      box.isWrongBox()
      this.closeBox(box)
    } else {
      box.isRightBox()
      const hiddenChar: HiddenChar = this.getHiddenChar(box.hiddenCharName)
      if (!hiddenChar) return
      this.tweens.add({
        targets: hiddenChar,
        y: '-=50',
        alpha: 1,
        scale: 1,
        duration: 500,
        onComplete: () => {
          hiddenChar.visible = true
          this.nextLevel()
        },
      })
    }
  }

  closeBox = (box: Box) => {
    if (!box) return
    this.time.delayedCall(1000, () => {
      box.close()
      this.player.active = true
    })
  }
}
