import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, SOUNDS } from '../utils/constants'

export class ButtonSmall extends Phaser.GameObjects.Sprite {
  group: Phaser.Physics.Arcade.StaticGroup
  config: ButtonConfig

  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y, `${config.name}-${config.prefix || BUTTON_PREFIX.NORMAL}`)
    scene.add.existing(this)
    this.config = config
    this.group = this.scene.physics.add.staticGroup()
    this.group.add(this)

    if (config.scale) {
      this.setScale(config.scale.x, config.scale.y)
    } else {
      this.setScale(0.5, 0.5)
    }

    const clickAudio = getOrAddAudio(scene, SOUNDS.CLICK)

    if (config.text?.title) {
      const text = this.scene.add
        .text(x, y - 5, config.text.title, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: config.text.fontSize || '48px',
        })
        .setOrigin(0.5, 0.5)
      this.group.add(text)
    }

    if (config.visible !== undefined) {
      this.group.setVisible(config.visible)
    }

    this.setInteractive().on('pointerdown', () => {
      if (this.texture.key.endsWith(BUTTON_PREFIX.BLOCKED)) return
      playSound(scene, clickAudio)
      config.onClick()
    })
  }

  changeTexture(prefix: BUTTON_PREFIX | BUTTON_PREFIX_EXTRA) {
    this.setTexture(`${this.config.name}-${prefix}`)
  }
}
