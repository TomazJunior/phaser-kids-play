import { FONTS, SPRITE_NAME } from '../utils/constants'

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y)
    scene.add.existing(this)

    const offset = 15
    const initX = (config.parentWidth || 0) * 0.5

    const panel = config.text
      ? scene.add.image(-initX, 0, SPRITE_NAME.BLUE_SHEET, 'blue_button02.png').setScale(1.6, 2).setOrigin(0, 0)
      : scene.add.image(-initX, 0, SPRITE_NAME.BLUE_SHEET, 'blue_circle.png').setScale(2.5).setOrigin(0, 0)

    const button = scene.add.image(-initX - offset, -5, config.icon, config.iconFrame).setOrigin(0, 0)
    this.add(panel).add(button)

    if (config.text) {
      const text = scene.add
        .text(-initX + button.width - offset, panel.height * 0.5, config.text, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '46px',
        })
        .setOrigin(0, 0)
      this.add(text)
    }

    panel.setInteractive().on('pointerdown', () => {
      config.onClick()
    })
  }
}
