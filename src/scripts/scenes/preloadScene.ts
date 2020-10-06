import { SPRITE_NAME } from '../utils/constants'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('start', 'assets/img/play-button.png')
    this.load.image('previous', 'assets/img/reply.png')
    this.load.image('back', 'assets/img/rounded-back.png')
    this.load.image('refresh', 'assets/img/refresh.png')
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

    this.load.bitmapFont('shortStack', 'assets/fonts/shortStack.png', 'assets/fonts/shortStack.xml')
  }

  create() {
    this.scene.start('MenuScene')
    // this.scene.start('MainScene')
  }
}
