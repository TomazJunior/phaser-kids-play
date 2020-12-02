import { updateUserInfo } from '../controllers/deviceInfo'
import BackgroundParallax from '../ui/backgroundParallax'
import ProgressBar from '../ui/progressBar'
import { createAnimations } from '../utils/animations'
import { updateSoundState } from '../utils/audioUtil'
import {
  BUTTON,
  BUTTON_PREFIX,
  BUTTON_PREFIX_EXTRA,
  FONTS,
  GAME,
  GAME_WORLDS,
  SCENES,
  SOUNDS,
  SPRITE_NAME,
} from '../utils/constants'
import { SKILL_ITEM_SKINS } from '../utils/skillItems'

export default class PreloadScene extends Phaser.Scene {
  progressBar: ProgressBar
  background: BackgroundParallax
  constructor() {
    super({ key: SCENES.PRELOAD_SCENE })
  }

  preload() {
    createAnimations(this)

    const { width, height } = this.scale

    this.background = new BackgroundParallax(this, true, true)

    this.progressBar = new ProgressBar(this, width * 0.4, height * 0.5)
    const playerSprite = this.add
      .sprite(width * 0.5, height - 100, SPRITE_NAME.SOKOBAN)
      .setScale(1.5)
    playerSprite.play('right-walk', true)

    this.load.image('box-opened', 'assets/img/box-opened.png')
    this.load.image('box-closed', 'assets/img/box-closed.png')
    this.load.image('box-wrong', 'assets/img/box-wrong.png')

    this.load.image('door-closed-mid', 'assets/img/door-closed-mid.png')
    this.load.image('door-closed-top', 'assets/img/door-closed-top.png')
    this.load.image('door-open-mid', 'assets/img/door-open-mid.png')
    this.load.image('door-open-top', 'assets/img/door-open-top.png')
    this.load.image('sign-exit', 'assets/img/sign-exit.png')

    this.load.image('finger-point', 'assets/img/finger-point-gesture.png')

    this.load.image('stars-zero', 'assets/img/stars-zero.png')
    this.load.image('stars-one', 'assets/img/stars-one.png')
    this.load.image('stars-two', 'assets/img/stars-two.png')
    this.load.image('stars-three', 'assets/img/stars-three.png')
    this.load.image('round-indicator-normal', 'assets/img/round-indicator-normal.png')
    this.load.image('round-indicator-inactive', 'assets/img/round-indicator-inactive.png')
    this.load.image('icon-checked', 'assets/img/icon-checked.png')
    this.load.image('icon-x', 'assets/img/icon-x.png')

    this.load.image('level-complete-dialog', 'assets/img/level-complete-dialog.png')
    this.load.image('big-frame-window', 'assets/img/big-frame-window.png')
    this.load.image('small-frame-window', 'assets/img/small-frame-window.png')
    this.load.image('small-frame', 'assets/img/small-frame.png')
    this.load.image('small-frame-level', 'assets/img/small-frame-level.png')
    this.load.image('frame-char-dialog', 'assets/img/frame-char-dialog.png')
    this.load.image('frame-loading-dialog', 'assets/img/frame-loading-dialog.png')

    this.load.bitmapFont(FONTS.PIXEL_FONT, 'assets/fonts/pixelFont.png', 'assets/fonts/pixelFont.xml')

    this.load.audio(SOUNDS.CLICK, 'assets/audio/click5.mp3')
    this.load.audio(SOUNDS.FIND_HIDDEN, 'assets/audio/find-hidden.mp3')
    this.load.audio(SOUNDS.NEXT_LEVEL, 'assets/audio/next-level.mp3')
    this.load.audio(SOUNDS.CLICK_TARGET, 'assets/audio/434756_notarget_wood-step-sample-1.mp3')
    this.load.audio(SOUNDS.WRONG_TARGET, 'assets/audio/350984__cabled-mess__lose-c-03.mp3')
    this.load.audio(SOUNDS.WALKING, 'assets/audio/430708_juandamb_running.mp3')
    this.load.audio(SOUNDS.ENTER_THE_DOOR, 'assets/audio/enter-the-door.mp3')
    this.load.audio(SOUNDS.ENTER_THE_BOX, 'assets/audio/enter-the-box.mp3')

    //tiles from worlds
    this.loadSpritesGameWorld()

    //buttons
    this.loadImageButtons()

    this.load.image('frame-skill-item', 'assets/img/frame-skill-item.png')
    this.load.image('frame-skill-item-selected', 'assets/img/frame-skill-item-selected1.png')

    this.load.image('circle-green-checkmark', 'assets/img/circle-green-checkmark.png')
    this.load.image('circle-yellow-checkmark', 'assets/img/circle-yellow-checkmark.png')

    this.load.image('circle-red', 'assets/img/circle-red.png')
    this.load.image('circle-green', 'assets/img/circle-green.png')
    this.load.image('circle-blue', 'assets/img/circle-blue.png')
    this.load.image('circle-blue-chart', 'assets/img/circle-blue-chart.png')
    this.load.image('circle-grey', 'assets/img/circle-grey.png')
    this.load.image('circle-yellow', 'assets/img/circle-yellow.png')
    this.load.image('gem-score', 'assets/img/gem-score.png')
    this.load.image('skill-gem-cost', 'assets/img/skill-gem-cost.png')
    this.load.image('skill-item-spot-shadow', 'assets/img/skill-item-spot-shadow.png')

    //skill items
    this.loadSkillItemsImages()

    //TODO: add credits
    /*
    Two Pianos by Stefan Kartenberg (c) copyright 2018 Licensed under a Creative Commons Attribution (3.0) license. 
    http://dig.ccmixter.org/files/JeffSpeed68/57454 
    Ft: Admiral Bob (admiralbob77)
    */
    this.load.audio(SOUNDS.BACKGROUND, 'assets/audio/background-01.mp3')

    this.loadAssetsProgress()
  }

  private loadImageButtons() {
    Object.keys(BUTTON).forEach((key) => {
      Object.keys(BUTTON_PREFIX).forEach((prefix) => {
        const buttonKey = `${BUTTON[key]}-${BUTTON_PREFIX[prefix]}`
        this.load.image(buttonKey, `assets/img/${buttonKey}.png`)
      })
    })
    this.load.image(
      `${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}`,
      `assets/img/${BUTTON.SOUND}-${BUTTON_PREFIX_EXTRA.INACTIVE}.png`
    )
    this.load.image(
      `${BUTTON.SOUND_BG}-${BUTTON_PREFIX_EXTRA.INACTIVE}`,
      `assets/img/${BUTTON.SOUND_BG}-${BUTTON_PREFIX_EXTRA.INACTIVE}.png`
    )
  }

  private loadSkillItemsImages() {
    Object.keys(SKILL_ITEM_SKINS).forEach((key) => {
      this.load.image(SKILL_ITEM_SKINS[key], `assets/img/${SKILL_ITEM_SKINS[key]}.png`)
      this.load.image(`${SKILL_ITEM_SKINS[key]}-inactive`, `assets/img/${SKILL_ITEM_SKINS[key]}-inactive.png`)
    })
  }
  private loadAssetsProgress = () => {
    this.load.on('progress', (value) => this.progressBar.updateValue(value - 0.1))
    // this.load.on('fileprogress', (file) => {
    //   console.log(file.src)
    // })
    this.load.on('complete', async () => {
      this.progressBar.updateValue(0.95)
      await updateUserInfo()
      this.progressBar.updateValue(1)

      this.time.delayedCall(Phaser.Math.Between(50, 200), () => {
        // this.scene.start(SCENES.LEVEL_SCENE)
        this.scene.start(SCENES.MENU_SCENE)
        // this.scene.start(SCENES.CONFIG_SCENE)
        // this.scene.start(SCENES.SELECT_ITEMS_SCENE, <CurrentWorldAndLevelConfig>{
        //   gameWorld: GAME_WORLDS[0],
        //   level: GAME_WORLDS[0].levels[0],
        // })
        // this.scene.start(SCENES.MAIN_SCENE, <MainSceneConfig>{
        //   gameWorld: GAME_WORLDS[0],
        //   level: GAME_WORLDS[0].levels[0],
        //   skillItems: [{
        //     skin: SKILL_ITEM_SKINS.BOX,
        //     quantity: 5
        //   },{
        //     skin: SKILL_ITEM_SKINS.KEY,
        //     quantity: 5
        //   },{
        //     skin: SKILL_ITEM_SKINS.STAR,
        //     quantity: 5
        //   }],
        // })
        // this.scene.start(SCENES.PAUSE_SCENE)
      })
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
    updateSoundState(this)
  }
}
