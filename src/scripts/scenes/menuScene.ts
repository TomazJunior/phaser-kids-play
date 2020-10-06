import { SPRITE_NAME } from '../utils/constants'
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }
  create() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    const title = this.add.bitmapText(0, 0, 'shortStack', 'Game for kids', 82).setOrigin(0, 0)
    const container = this.add.container(width * 0.5 - title.width * 0.8, height * 0.5)
    const panel = this.add
      .image(title.width, 0, SPRITE_NAME.BLUE_SHEET, 'blue_button02.png')
      .setScale(1.5, 2)
      .setOrigin(0, 0)
    const startButton = this.add.image(title.width + 10, panel.height * 0.5 - 10, 'start').setOrigin(0, 0)
    const text = this.add.text(startButton.x + startButton.width + 20, panel.height * 0.5, 'START', {
      fontFamily: 'AlloyInk',
      fontSize: '46px',
    })

    container.add(title).add(panel).add(startButton).add(text)

    panel.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.scene.start('MainScene')
    })
  }
}
