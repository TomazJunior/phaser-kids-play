import ProgressBar from '../ui/progressBar'
import { changeSoundState } from '../utils/audioUtil'
import { BUTTON, BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, SOUNDS, SPRITE_NAME } from '../utils/constants'
import { isSoundEnabled } from '../utils/fileStorage'

export default class PreloadScene extends Phaser.Scene {
  progressBar: ProgressBar
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const { width, height } = this.scale
    this.progressBar = new ProgressBar(this, width * 0.4, height * 0.5)

    this.load.image('background', 'assets/img/background.png')
    this.load.spritesheet(SPRITE_NAME.SOKOBAN, 'assets/img/sokoban_tilesheet.png', {
      frameWidth: 64,
    })

    this.load.atlasXML(
      SPRITE_NAME.ROUND_ANIMALS,
      'assets/img/round_nodetailsOutline.png',
      'assets/img/round_nodetailsOutline.xml'
    )

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
    this.load.image('small-frame-window', 'assets/img/small-frame-window.png')

    this.load.bitmapFont(FONTS.PIXEL_FONT, 'assets/fonts/pixelFont.png', 'assets/fonts/pixelFont.xml')

    this.load.audio(SOUNDS.CLICK, 'assets/audio/click5.mp3')
    this.load.audio(SOUNDS.FIND_HIDDEN, 'assets/audio/find-hidden.mp3')
    this.load.audio(SOUNDS.NEXT_LEVEL, 'assets/audio/next-level.mp3')
    this.load.audio(SOUNDS.CLICK_BOX, 'assets/audio/434756_notarget_wood-step-sample-1.mp3')
    this.load.audio(SOUNDS.WRONG_BOX, 'assets/audio/350984__cabled-mess__lose-c-03.mp3')
    this.load.audio(SOUNDS.WALKING, 'assets/audio/430708_juandamb_running.mp3')
    //buttons
    this.loadImageButtons()

    //TODO: add credits
    /*
    Two Pianos by Stefan Kartenberg (c) copyright 2018 Licensed under a Creative Commons Attribution (3.0) license. 
    http://dig.ccmixter.org/files/JeffSpeed68/57454 
    Ft: Admiral Bob (admiralbob77)
    */
    this.load.audio(SOUNDS.BACKGROUND, 'assets/audio/two-pianos.mp3')

    this.loadAssetsProgress()
  }

  loadImageButtons() {
    Object.keys(BUTTON).forEach((key) => {
      Object.keys(BUTTON_PREFIX).forEach((prefix) => {
        const buttonKey = `${BUTTON[key]}-${BUTTON_PREFIX[prefix]}`
        this.load.image(buttonKey, `assets/img/${buttonKey}.png`)
      })
    })
    this.load.image(`${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}`, `assets/img/${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}.png`)
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

  create() {
    changeSoundState(this, isSoundEnabled())
  }
}
