import ProgressBar from '../ui/progressBar'
import { changeSoundState } from '../utils/audioUtil'
import { BUTTON, BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, GAME_WORLDS, SCENES, SOUNDS, SPRITE_NAME } from '../utils/constants'
import { isSoundEnabled } from '../utils/fileStorage'

export default class PreloadScene extends Phaser.Scene {
  progressBar: ProgressBar
  constructor() {
    super({ key: SCENES.PRELOAD_SCENE })
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

    this.load.image('stars-zero', 'assets/img/stars-zero.png')
    this.load.image('stars-one', 'assets/img/stars-one.png')
    this.load.image('stars-two', 'assets/img/stars-two.png')
    this.load.image('stars-three', 'assets/img/stars-three.png')

    this.load.image('level-complete-dialog', 'assets/img/level-complete-dialog.png')
    this.load.image('big-frame-window', 'assets/img/big-frame-window.png')
    this.load.image('small-frame-window', 'assets/img/small-frame-window.png')
    this.load.image('small-frame', 'assets/img/small-frame.png')
    this.load.image('small-frame-level', 'assets/img/small-frame-level.png')
    
    this.load.bitmapFont(FONTS.PIXEL_FONT, 'assets/fonts/pixelFont.png', 'assets/fonts/pixelFont.xml')

    this.load.audio(SOUNDS.CLICK, 'assets/audio/click5.mp3')
    this.load.audio(SOUNDS.FIND_HIDDEN, 'assets/audio/find-hidden.mp3')
    this.load.audio(SOUNDS.NEXT_LEVEL, 'assets/audio/next-level.mp3')
    this.load.audio(SOUNDS.CLICK_TARGET, 'assets/audio/434756_notarget_wood-step-sample-1.mp3')
    this.load.audio(SOUNDS.WRONG_TARGET, 'assets/audio/350984__cabled-mess__lose-c-03.mp3')
    this.load.audio(SOUNDS.WALKING, 'assets/audio/430708_juandamb_running.mp3')
    
    //tiles from worlds
    this.loadSpritesGameWorld()
    
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

  private loadImageButtons() {
    Object.keys(BUTTON).forEach((key) => {
      Object.keys(BUTTON_PREFIX).forEach((prefix) => {
        const buttonKey = `${BUTTON[key]}-${BUTTON_PREFIX[prefix]}`
        this.load.image(buttonKey, `assets/img/${buttonKey}.png`)
      })
    })
    this.load.image(`${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}`, `assets/img/${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}.png`)
  }

  private loadAssetsProgress = () => {
    this.load.on('progress', this.progressBar.updateValue)
    // this.load.on('fileprogress', (file) => {
    //   console.log(file.src)
    // })
    this.load.on('complete', () => {
      // this.scene.start(SCENES.LEVEL_SCENE)
      this.scene.start(SCENES.MENU_SCENE)
      // this.scene.start(SCENES.MAIN_SCENE, <MainSceneConfig>{
      //   gameWorld: GAME_WORLDS[0],
      //   level: GAME_WORLDS[0].levels[0]
      // })
    })
  }

  private loadSpritesGameWorld = () => {
    // world-2
    this.load.image('world-2-grass', 'assets/img/world/world-2/grass.png')
    this.load.image('world-2-dirt', 'assets/img/world/world-2/path-dirt.png')
    this.load.image('world-2-dirt-left', 'assets/img/world/world-2/dirt-left.png')
    this.load.image('world-2-dirt-right', 'assets/img/world/world-2/dirt-right.png')
    this.load.image('world-2-dirt-top', 'assets/img/world/world-2/dirt-top.png')
    this.load.image('world-2-dirt-bottom', 'assets/img/world/world-2/dirt-bottom.png')
    this.load.image('world-2-dirt-right-bottom', 'assets/img/world/world-2/dirt-right-bottom.png')
    this.load.image('world-2-dirt-right-top', 'assets/img/world/world-2/dirt-right-top.png')
    this.load.image('world-2-dirt-left-bottom', 'assets/img/world/world-2/dirt-left-bottom.png')
    this.load.image('world-2-dirt-left-top', 'assets/img/world/world-2/dirt-left-top.png')
    
    this.load.image('world-2-grass-top-left', 'assets/img/world/world-2/grass-top-left.png')
    this.load.image('world-2-grass-top-right', 'assets/img/world/world-2/grass-top-right.png')
    
    this.load.image('world-2-flower-six-points', 'assets/img/world/world-2/flower-six-points.png')
    this.load.image('world-2-flower-three-points', 'assets/img/world/world-2/flower-three-points.png')
    
    this.load.image('world-2-tree-big', 'assets/img/world/world-2/tree-big.png')
    this.load.image('world-2-tree-tiny', 'assets/img/world/world-2/tree-tiny.png')

    this.load.image('world-2-rock-big', 'assets/img/world/world-2/rock-big.png')
    this.load.image('world-2-rock-small', 'assets/img/world/world-2/rock-small.png')
    this.load.image('world-2-rock-tiny', 'assets/img/world/world-2/rock-tiny.png')
  }

  create() {
    changeSoundState(this, isSoundEnabled())
  }
}
