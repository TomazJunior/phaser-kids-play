import { BUTTON, BUTTON_PREFIX, FONTS } from '../utils/constants'

export class ButtonSmall extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, name: BUTTON, private onClick: () => void, private text: string = '') {
    super(scene, x, y, `${name}-${BUTTON_PREFIX.NORMAL}`)
    scene.add.existing(this)
    this.setScale(0.5, 0.5)

    const clickAudio = scene.sound.get('click') || scene.sound.add('click')

    if (text) {
      this.scene.add.text(x, y, text, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      }).setOrigin(0.5, 0.5)
    }
    
    this.setInteractive()
      .on('pointerover', () => {
        this.setTexture(`${name}-${BUTTON_PREFIX.HOVER}`)
      })
      .on('pointerout', () => {
        this.setTexture(`${name}-${BUTTON_PREFIX.NORMAL}`)
      })
      .on('pointerdown', () => {
        this.setTexture(`${name}-${BUTTON_PREFIX.CLICK}`)
      })
      .on('pointerup', () => {
        this.setTexture(`${name}-${BUTTON_PREFIX.HOVER}`)
      })
      .on('pointerdown', () => {
        this.setTexture(`${name}-${BUTTON_PREFIX.CLICK}`)
        clickAudio.play()
        this.onClick()
      })
  }
}
