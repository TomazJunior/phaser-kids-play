import { Button } from '../ui/button'
import { FONTS } from './constants'

export class ModalDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, config: ModalDialogConfig) {
    super(scene, scene.scale.width * 0.5, scene.scale.height * 0.5)
    scene.add.existing(this)
    
    const offset = 15
    const panel = scene.add.image(0, 0, 'modalbg').setScale(1.3, 1)
    const title = scene.add
      .text(0, -offset * 3.5, config.content, {
        color: 'green',
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '96px',
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
}
