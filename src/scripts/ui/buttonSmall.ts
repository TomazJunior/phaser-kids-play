import { BUTTON, BUTTON_PREFIX, FONTS } from '../utils/constants'

export class ButtonSmall extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y, `${config.name}-${BUTTON_PREFIX.NORMAL}`)
    scene.add.existing(this)
    this.setScale(0.5, 0.5)

    const clickAudio = scene.sound.get('click') || scene.sound.add('click')

    if (config.text) {
      this.scene.add.text(x, y, config.text, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      }).setOrigin(0.5, 0.5)
    }
    
    this.setInteractive()
      .on('pointerover', () => {
        this.setTexture(`${config.name}-${BUTTON_PREFIX.HOVER}`)
      })
      .on('pointerout', () => {
        this.setTexture(`${config.name}-${BUTTON_PREFIX.NORMAL}`)
      })
      .on('pointerdown', () => {
        this.setTexture(`${config.name}-${BUTTON_PREFIX.CLICK}`)
      })
      .on('pointerup', () => {
        this.setTexture(`${config.name}-${BUTTON_PREFIX.HOVER}`)
      })
      .on('pointerdown', () => {
        this.setTexture(`${config.name}-${BUTTON_PREFIX.CLICK}`)
        clickAudio.play()
        config.onClick()
      })
  }
}
