import ProgressBar from '../ui/progressBar'
import { BUTTON, BUTTON_PREFIX, FONTS, SPRITE_NAME } from '../utils/constants'

export default class PreloadScene extends Phaser.Scene {
  progressBar: ProgressBar
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const { width, height } = this.scale
    this.progressBar = new ProgressBar(this, width * 0.4, height * 0.5)

    this.load.image('background', 'assets/img/background.png')
    this.load.image('modalbg', 'assets/img/modalBg.png')
    this.load.spritesheet(SPRITE_NAME.SOKOBAN, 'assets/img/sokoban_tilesheet.png', {
      frameWidth: 64,
    })

    this.load.atlasXML(
      SPRITE_NAME.ROUND_ANIMALS,
      'assets/img/round_nodetailsOutline.png',
      'assets/img/round_nodetailsOutline.xml'
    )

    this.load.atlasXML(SPRITE_NAME.BLUE_SHEET, 'assets/img/blueSheet.png', 'assets/img/blueSheet.xml')

    this.load.atlasXML(SPRITE_NAME.WHITE_SHEET, 'assets/img/sheet_white2x.png', 'assets/img/sheet_white2x.xml')

    this.load.image('finger-point', 'assets/img/finger-point-gesture.png')

    this.load.image('chest-closed', 'assets/img/chest-closed.png')
    this.load.image('chest-opened', 'assets/img/chest-opened.png')
    this.load.image('chest-lid', 'assets/img/chest-lid.png')
    this.load.image('dirt-block', 'assets/img/dirt-block.png')
    this.load.image('grass-block', 'assets/img/grass-block.png')

    this.load.image('stars-zero', 'assets/img/stars-zero.png')
    this.load.image('stars-one', 'assets/img/stars-one.png')
    this.load.image('stars-two', 'assets/img/stars-two.png')
    this.load.image('stars-three', 'assets/img/stars-three.png')

    this.load.image('level-complete-dialog', 'assets/img/level-complete-dialog.png')
    this.load.image('big-frame-window', 'assets/img/big-frame-window.png')
    
    this.load.bitmapFont(FONTS.PIXEL_FONT, 'assets/fonts/pixelFont.png', 'assets/fonts/pixelFont.xml')
    this.load.bitmapFont(FONTS.SHORT_STACK, 'assets/fonts/shortStack.png', 'assets/fonts/shortStack.xml')

    this.load.audio('click', 'assets/audio/click5.ogg')
    this.load.audio('find-hidden', 'assets/audio/find-hidden.wav')
    this.load.audio('next-level', 'assets/audio/next-level.wav')
    this.load.audio('click-box', 'assets/audio/434756__notarget__wood-step-sample-1.wav')
    this.load.audio('wrong-box', 'assets/audio/350984__cabled-mess__lose-c-03.wav')
    this.load.audio('walking', 'assets/audio/430708__juandamb__running.wav')

    //buttons
    this.loadImageStates()

    //TODO: add credits
    /*
    Two Pianos by Stefan Kartenberg (c) copyright 2018 Licensed under a Creative Commons Attribution (3.0) license. 
    http://dig.ccmixter.org/files/JeffSpeed68/57454 
    Ft: Admiral Bob (admiralbob77)
    */
    this.load.audio('background-sound', 'assets/audio/two-pianos.mp3')

    this.loadAssetsProgress()
  }

  loadImageStates() {
    Object.keys(BUTTON).forEach((key) => {
      Object.keys(BUTTON_PREFIX).forEach((prefix) => {
        const buttonKey = `${BUTTON[key]}-${BUTTON_PREFIX[prefix]}`
        console.log('`${key}-${prefix}`', buttonKey)
        this.load.image(buttonKey, `assets/img/${buttonKey}.png`)
      })
    })
  }

  loadAssetsProgress = () => {
    this.load.on('progress', this.progressBar.updateValue)
    // this.load.on('fileprogress', (file) => {
    //   console.log(file.src)
    // })
    this.load.on('complete', () => {
      // this.scene.start('LevelScene')
      this.scene.start('MenuScene')
      // this.scene.start('MainScene')
    })
  }

  create() {}
}
