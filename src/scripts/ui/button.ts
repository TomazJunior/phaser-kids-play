import { SPRITE_NAME } from '../utils/constants'

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y)
    scene.add.existing(this)
    
    const offset = 15

    const panel = config.text ?
        scene.add.image(0, 0, SPRITE_NAME.BLUE_SHEET, 'blue_button02.png').setScale(1.5, 2).setOrigin(0, 0) :
        scene.add.image(0, 0, SPRITE_NAME.BLUE_SHEET, 'blue_circle.png').setScale(2.5).setOrigin(0, 0)
    
    const button = scene.add.image(-offset, -5, config.icon, config.iconFrame).setOrigin(0,0)
    this.add(panel).add(button)
    
    if (config.text) {
      const text = scene.add.text(button.width - offset * 2, panel.height * 0.5, config.text, {
        fontFamily: 'AlloyInk',
        fontSize: '46px',
      }).setOrigin(0,0)
      this.add(text)
    }
    
    panel.setInteractive().on('pointerdown', () => {
      config.onClick()
    })
  }
}
