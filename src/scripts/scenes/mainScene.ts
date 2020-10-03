import Player from '../objects/player'
import Box from '../objects/box'
import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_BOX, PLAYER_CHAR_REACHED_BOX, PLAYER_TOUCHED_BOX } from '../events/events'
import { getRandomSkin } from '../utils/skinUtils'
import { SKINS, SPRITE_NAME } from '../utils/constants'
import { ModalDialog } from '../utils/modalDialog'

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2],
]

export default class MainScene extends Phaser.Scene {
  boxes: Phaser.Physics.Arcade.StaticGroup
  player: Player
  hiddenChar: HiddenChar
  activeBox: Box
  currentHiddenSkin: SKINS
  gameover = false

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.gameover = false
  }

  create() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)

    background.setScale(scale).setScrollFactor(0)

    this.player = new Player(this, width * 0.1, height * 0.95)
    this.player.on(PLAYER_CHAR_REACHED_BOX, this.handleReachedBox)

    this.currentHiddenSkin = getRandomSkin()

    this.add
      .sprite(width * 0.5, 40, SPRITE_NAME.ROUND_ANIMALS, this.currentHiddenSkin)
      .setOrigin(0.5)
      .setScale(0.5)

    this.createBoxes()
    this.hiddenChar = new HiddenChar(this, width * 0.05, height * 0.1, this.currentHiddenSkin)
    this.hiddenChar.on(HIDDEN_CHAR_REACHED_BOX, this.activateUser)

    this.physics.add.collider(this.player, this.boxes, undefined, undefined, this)
    this.physics.add.collider(this.hiddenChar, this.boxes, undefined, undefined, this)

    const randomBoxPos = Math.floor(Math.random() * 8)
    const box = <Box>this.boxes.children.getArray()[randomBoxPos]
    this.hiddenChar.goTo(box)
  }

  createDialog = () => {
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
      this.time.delayedCall(200, () => {
        this.scene.restart()
      })
    })
  }

  update() {
    if (this.gameover) return
  }

  createBoxes = () => {
    this.boxes = this.physics.add.staticGroup()
    const width = this.scale.width
    let xPer = 0.25
    let y = 250
    let id = 0
    for (let row = 0; row < level.length; ++row) {
      for (let col = 0; col < level[row].length; ++col) {
        const box = new Box(this, width * xPer, y, level[row][col], this.boxes, ++id)
        box.on(PLAYER_TOUCHED_BOX, this.handlePlayerGoToBox)
        xPer += 0.25
      }

      xPer = 0.25
      y += 200
    }
  }

  handlePlayerGoToBox = (box: Box) => {
    this.player.goTo(box)
  }

  activateUser = () => {
    this.player.active = true
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
      this.time.delayedCall(1000, () => {
        box.reset()
        this.player.active = true
      })
    } else {
      box.isRightBox()
      const { width, height } = this.scale
      this.tweens.add({
        targets: this.hiddenChar,
        y: '-=50',
        alpha: 1,
        scale: 1,
        duration: 500,
        onComplete: () => {
          this.hiddenChar.visible = true
          this.createDialog()
        },
      })
    }
  }
}
