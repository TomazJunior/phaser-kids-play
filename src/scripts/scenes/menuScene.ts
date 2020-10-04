import { createLabel } from '../utils/textUtil'
import { Sizer, Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
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

    const buttons = new Buttons(this, {
      buttons: [createLabel(this, { content: 'START', icon: 'start' })],
    })

    const group: Sizer = new Sizer(this, width * 0.5, height * 0.5, 200, 40)
    group
      .add(this.add.bitmapText(width * 0.5, height * 0.5, 'shortStack', 'Game for kids', 82))
      .addSpace()
      .add(buttons)
      .addSpace()
      .layout()

    buttons.on(
      'button.click',
      (button, groupName, index, pointer, event) => {
        this.scene.start('MainScene')
      },
      this
    )
  }
}
