import { ButtonSmall } from '../ui/buttonSmall'
import { BUTTON, FONTS, LEVELS } from '../utils/constants'

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' })
  }
  create() {
    this.createBackground()
    this.createSelectLevelFrame()
    this.createBackButton()
  }

  createBackButton() {
    new ButtonSmall(this, 10, 10, {
      name: BUTTON.LEFT,
      onClick: () => {
        this.scene.start('MenuScene')
      },
    }).setOrigin(0, 0)
  }

  createBackground() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)
  }

  createSelectLevelFrame() {
    const { width, height } = this.scale
    const frame = this.add.image(width * 0.5, height * 0.5, 'big-frame-window')
    const textTitle = this.add
      .text(frame.x - 20, frame.y - frame.displayHeight * 0.5 + 20, 'Select Level', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setOrigin(0.5, 0)

    const initialX = frame.x - frame.displayWidth * 0.5 + 120
    const initialY = frame.y - 80
    let posX = initialX
    let posY = initialY
    LEVELS.forEach((level, index) => {
      if (index) {
        posX += 100
      }

      if (posX - initialX > frame.displayWidth - 200) {
        posX = initialX
        posY += 100
      }

      new ButtonSmall(this, posX, posY, {
        name: BUTTON.EMPTY,
        onClick: () => {
          this.scene.start('MainScene', level)
        },
        text: level.level.toString(),
      })
    })
  }
}
