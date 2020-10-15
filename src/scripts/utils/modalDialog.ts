import { Button } from '../ui/button'
import { FONTS } from './constants'

export class ModalDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, private config: ModalDialogConfig) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5)
    scene.add.existing(this)

    const panel = scene.add.image(0, 0, 'modalbg').setScale(1.3, 1)
    const { x, y, text } = config.content
    const title = scene.add
      .text(x, y, text, {
        color: config.content.color,
        fontFamily: FONTS.ALLOY_INK,
        fontSize: config.content.fontSize,
      })
      .setOrigin(0.5, 1)

    this.add(panel).add(title)

    if (config.subContent) {
      const subTitle = scene.add
        .text(config.subContent.x, config.subContent.y, config.subContent.text, {
          color: config.subContent.color,
          fontFamily: FONTS.ALLOY_INK,
          fontSize: config.subContent.fontSize,
        })
        .setOrigin(0.5, 1)

      this.add(subTitle)
    }

    const initialPos = config.buttonConfigs.length === 1 ? (this.x - panel.width) * 2 : -40
    let previousButton: Button
    config.buttonConfigs.forEach((buttonConfig) => {
      const x = !!previousButton ? previousButton.getBounds().width : initialPos
      previousButton = new Button(scene, x, 40, {
        ...buttonConfig,
        parentWidth: panel.width,
      })

      this.add(previousButton)
    })
  }

  close() {
    this.setVisible(false)
    if (this.config.onClose) {
      this.config.onClose()
    }
  }
}
