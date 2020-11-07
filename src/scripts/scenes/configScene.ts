import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonSmall } from '../ui/buttonSmall'
import { InfoDialog } from '../ui/creditsDialog'
import { updateSoundState } from '../utils/audioUtil'
import { BUTTON, BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, SCENES } from '../utils/constants'
import {
  clearTutorial,
  isBackgroundSoundEnabled,
  isSoundEnabled,
  setBackgroundSoundEnabled,
  setSoundEnabled,
} from '../utils/fileStorage'

export default class ConfigScene extends Phaser.Scene {
  
  constructor() {
    super({ key: SCENES.CONFIG_SCENE })
  }

  create() {
    const { width, height } = this.scale
    this.scene.bringToTop()
    
    new BackgroundParallax(this, false, false)

    const frame = this.add.image(width * 0.5, height * 0.5, 'small-frame-window').setOrigin(0.5, 0.5)

    const textTitle = this.add
      .text(frame.x, frame.y - frame.displayHeight * 0.5 + 50, 'CONFIG', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setStroke('#901215', 10)
      .setOrigin(0.5, 0.5)

    this.createSoundButton(
      frame.x - frame.displayWidth * 0.5 + 150,
      frame.y - frame.displayHeight * 0.5 + 210,
      BUTTON.SOUND_BG,
      isBackgroundSoundEnabled,
      setBackgroundSoundEnabled
    )

    this.createSoundButton(
      frame.x - frame.displayWidth * 0.5 + 300,
      frame.y - frame.displayHeight * 0.5 + 210,
      BUTTON.SOUND,
      isSoundEnabled,
      setSoundEnabled
    )

    new ButtonSmall(this, frame.x - frame.displayWidth * 0.5 + 150, frame.y - frame.displayHeight * 0.5 + 350, {
      name: BUTTON.HOME,
      scale: {
        x: 0.7,
        y: 0.7,
      },
      onClick: () => {
        this.scene.stop(SCENES.CONFIG_SCENE)
        this.scene.start(SCENES.MENU_SCENE)
      },
    }).setOrigin(0.5, 0.5)

    new ButtonSmall(this, frame.x - frame.displayWidth * 0.5 + 300, frame.y - frame.displayHeight * 0.5 + 350, {
      name: BUTTON.INFO,
      scale: {
        x: 0.7,
        y: 0.7,
      },
      onClick: () => {
        //TODO: that's temporary
        clearTutorial()
        new InfoDialog(this, width * 0.5, height * 0.5)
      },
    }).setOrigin(0.5, 0.5)
    
  }

  createSoundButton(
    x: number,
    y: number,
    name: BUTTON,
    handleIsSoundEnabled: () => boolean,
    handleSetConfigState: (state: boolean) => void
  ) {
    const buttonEnabled = handleIsSoundEnabled()
    const button = new ButtonSmall(this, x, y, {
      name,
      prefix: buttonEnabled ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX_EXTRA.INACTIVE,
      scale: {
        x: 0.7,
        y: 0.7,
      },
      onClick: () => {
        const buttonEnabled = handleIsSoundEnabled()
        const buttonEnabledState = !buttonEnabled
        handleSetConfigState(buttonEnabledState)
        updateSoundState(this)
        button.changeTexture(buttonEnabledState ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX_EXTRA.INACTIVE)
      },
    }).setOrigin(0.5, 0.5)
  }
}
