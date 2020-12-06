import { FONTS, SCENES, SPRITE_NAME } from '../utils/constants'

export default class BootScene extends Phaser.Scene {
  background: Phaser.GameObjects.Rectangle
  constructor() {
    super(SCENES.BOOT_SCENE)
  }

  preload() {
    const { width, height } = this.scale
    this.createBackground()

    const title = this.add
      .text(width * 0.5, height * 0.5, 'TJ Studios', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '156px',
        color: '#07d802',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('#048001', 20)

    this.load.image('background-forest', 'assets/img/background-forest.png')
    this.load.image('background-forest-2nd-layer', 'assets/img/background-forest-2nd-layer.png')

    this.load.spritesheet('firework', 'assets/img/firework.png', {
      frameWidth: 256,
      frameHeight: 256,
    })
    this.load.spritesheet(SPRITE_NAME.SOKOBAN, 'assets/img/sokoban_tilesheet.png', {
      frameWidth: 64,
    })
    this.load.atlasXML(
      SPRITE_NAME.ROUND_ANIMALS,
      'assets/img/round_nodetailsOutline.png',
      'assets/img/round_nodetailsOutline.xml'
    )
  }

  private createBackground = () => {
    const { width, height } = this.scale
    this.background = this.add.rectangle(width * 0.5, height * 0.5, 500, 500, 0xffffff).setInteractive()
    let scaleX = width / this.background.width
    let scaleY = height / this.background.height
    let scale = Math.max(scaleX, scaleY)
    this.background.setScale(scale).setScrollFactor(0)
  }

  create() {
    this.background.destroy(true)
    this.scene.stop(SCENES.BOOT_SCENE)
    this.scene.start(SCENES.PRELOAD_SCENE)
  }
}
