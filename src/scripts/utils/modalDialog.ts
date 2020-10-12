import { Button } from '../ui/button'
import { FONTS } from './constants'

export class ModalDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, private config: ModalDialogConfig) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5)
    scene.add.existing(this)
    
    const panel = scene.add.image(0, 0, 'modalbg').setScale(1.3, 1)
    const {x, y, text} = config.content
    const title = scene.add
      .text(x, y, text, {
        color: 'green',
        fontFamily: FONTS.ALLOY_INK,
        fontSize: config.content.fontSize,
      }).setOrigin(0.5, 1)
      
    this.add(panel).add(title)

    const initialPos = -40
    let previousButton: Button
    config.buttonConfigs.forEach((buttonConfig, i) => {
      const x = !!previousButton ? previousButton.getBounds().width : initialPos
      previousButton = new Button(scene, x, 0, {
        ...buttonConfig,
        parentWidth: panel.width
      })
      this.add(previousButton)
    });
  }

  close() {
    this.setVisible(false)
    if (this.config.onClose) {
      this.config.onClose() 
    }
  }
}
