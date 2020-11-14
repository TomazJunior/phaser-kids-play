import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, SOUNDS } from '../utils/constants'

export class ButtonSmall extends Phaser.GameObjects.Group {
  button: Phaser.GameObjects.Sprite
  config: ButtonConfig

  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene)
    scene.add.existing(this)
    this.button = scene.add.sprite(x, y, `${config.name}-${config.prefix || BUTTON_PREFIX.NORMAL}`)
    this.config = config
    this.add(this.button)

    if (config.scale) {
      this.button.setScale(config.scale.x, config.scale.y)
    } else {
      this.button.setScale(0.5, 0.5)
    }

    const clickAudio = getOrAddAudio(scene, SOUNDS.CLICK)

    if (config.text?.title) {
      const text = this.scene.add
        .text(x, y - 5, config.text.title, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: config.text.fontSize || '48px',
        })
        .setOrigin(0.5, 0.5)
      this.add(text)
    }

    if (config.visible !== undefined) {
      this.setVisible(config.visible)
    }

    this.button.setInteractive().on('pointerdown', () => {
      if (this.button.texture.key.endsWith(BUTTON_PREFIX.BLOCKED)) return
      playSound(scene, clickAudio)
      config.onClick()
    })
  }

  changeTexture(prefix: BUTTON_PREFIX | BUTTON_PREFIX_EXTRA) {
    this.button.setTexture(`${this.config.name}-${prefix}`)
  }

  public get x(): number {
    return this.button.x
  }

  public get y(): number {
    return this.button.y
  }

  public get displayHeight(): number {
    return this.button.displayHeight
  }
}
