import { FONTS, SPRITE_NAME } from '../utils/constants'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('background', 'assets/img/MlQA2U.jpg')
    this.load.image('modalbg', 'assets/img/modalBg.png')
    this.load.spritesheet(SPRITE_NAME.SOKOBAN, 'assets/img/sokoban_tilesheet.png', {
      frameWidth: 64,
    })

    this.load.atlasXML(
      SPRITE_NAME.ROUND_ANIMALS,
      'assets/img/round_nodetailsOutline.png',
      'assets/img/round_nodetailsOutline.xml'
    )

    this.load.atlasXML(
      SPRITE_NAME.BLUE_SHEET,
      'assets/img/blueSheet.png',
      'assets/img/blueSheet.xml'
    )

    this.load.atlasXML(
      SPRITE_NAME.WHITE_SHEET,
      'assets/img/sheet_white2x.png',
      'assets/img/sheet_white2x.xml'
    )
    
    this.load.image('finger-point', 'assets/img/finger-point-gesture.png')

    this.load.bitmapFont(FONTS.SHORT_STACK, 'assets/fonts/shortStack.png', 'assets/fonts/shortStack.xml')
  }

  create() {
    this.scene.start('MenuScene')
    // this.scene.start('MainScene')
  }
}
