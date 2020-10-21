import { BUTTON, BUTTON_PREFIX, FONTS } from '../utils/constants'

export class ButtonSmall extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y, `${config.name}-${config.prefix || BUTTON_PREFIX.NORMAL}`)
    scene.add.existing(this)
    if (config.scale) {
      this.setScale(config.scale.x, config.scale.y)
    } else {
      this.setScale(0.5, 0.5)
    }

    const clickAudio = scene.sound.get('click') || scene.sound.add('click')

    if (config.text) {
      this.scene.add
        .text(x, y - 5, config.text, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '48px',
        })
        .setOrigin(0.5, 0.5)
    }

    this.setInteractive().on('pointerdown', () => {
      if (this.texture.key.endsWith(BUTTON_PREFIX.BLOCKED)) return
      clickAudio.play()
      config.onClick()
    })
  }
}
