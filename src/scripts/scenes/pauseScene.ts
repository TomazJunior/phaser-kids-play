import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonBig } from '../ui/buttonBig'
import { ButtonSmall } from '../ui/buttonSmall'
import { updateSoundState } from '../utils/audioUtil'
import { BUTTON, BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS, SCENES } from '../utils/constants'
import {
  isBackgroundSoundEnabled,
  isSoundEnabled,
  setBackgroundSoundEnabled,
  setSoundEnabled,
} from '../utils/fileStorage'

export default class PauseScene extends Phaser.Scene {
  private config: PauseSceneConfig

  constructor() {
    super({ key: SCENES.PAUSE_SCENE })
  }

  init(config: PauseSceneConfig) {
    this.config = config
  }

  create() {
    const { width, height } = this.scale
    this.scene.bringToTop()

    new BackgroundParallax(this, false, false)

    const frame = this.add.image(width * 0.5, height * 0.5, 'small-frame-window').setOrigin(0.5, 0.5)

    const textTitle = this.add
      .text(frame.x, frame.y - frame.displayHeight * 0.5 + 50, 'PAUSED', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
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
      onClick: this.config.onHome,
    }).setOrigin(0.5, 0.5)

    new ButtonSmall(this, frame.x - frame.displayWidth * 0.5 + 300, frame.y - frame.displayHeight * 0.5 + 350, {
      name: BUTTON.RESTART,
      scale: {
        x: 0.7,
        y: 0.7,
      },
      onClick: this.config.onRestart,
    }).setOrigin(0.5, 0.5)

    new ButtonBig(this, frame.x - 5, frame.y - frame.displayHeight * 0.5 + 480, {
      scale: {
        x: 0.6,
        y: 0.6,
      },
      text: {
        title: 'RESUME',
        fontSize: '46px',
        padding: {
          x: 20,
          y: 10,
        },
      },
      onClick: this.config.onResume,
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
