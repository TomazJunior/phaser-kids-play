import { FONTS, SPRITE_NAME } from '../utils/constants'

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y)
    scene.add.existing(this)

    
    const clickAudio = scene.sound.get('click') || scene.sound.add('click')
    const offset = 15
    const initX = (config.parentWidth || 0) * 0.5
    const scale = config.scale || { x: 1.6, y: 2 }
    const paddingX = config.paddingX || 0;

    const panel = config.text
      ? scene.add
          .image(-initX, 0, SPRITE_NAME.BLUE_SHEET, 'blue_button02.png')
          .setScale(scale.x, scale.y)
          .setOrigin(0, 0)
      : scene.add.image(-initX, 0, SPRITE_NAME.BLUE_SHEET, 'blue_circle.png').setScale(2.5).setOrigin(0, 0)

    const button = scene.add.image(-initX - offset + paddingX, -5, config.icon, config.iconFrame).setOrigin(0, 0)
    this.add(panel).add(button)

    if (config.text) {
      const text = scene.add
        .text(-initX + button.width - offset + paddingX, panel.height * 0.5, config.text, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '46px',
        })
        .setOrigin(0, 0)
      this.add(text)
    }

    panel.setInteractive().on('pointerdown', () => {
      clickAudio.play()
      config.onClick()
    })
  }
}
