import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonBig } from '../ui/buttonBig'
import { ButtonSmall } from '../ui/buttonSmall'
import { changeSoundState } from '../utils/audioUtil'
import { BUTTON, BUTTON_PREFIX, BUTTON_PREFIX_EXTRA, FONTS } from '../utils/constants'
import { isSoundEnabled, setSoundEnabled } from '../utils/fileStorage'

export default class PauseScene extends Phaser.Scene {
  private config: PauseSceneConfig

  constructor() {
    super({ key: 'PauseScene' })
  }

  init(config: PauseSceneConfig) {
    this.config = config
  }

  create() {
    const { width, height } = this.scale
    this.scene.bringToTop()

    // TODO: blur the background on pause

    const frame = this.add.image(width * 0.5, height * 0.5, 'small-frame-window').setOrigin(0.5, 0.5)

    const textTitle = this.add
      .text(frame.x, frame.y - frame.displayHeight * 0.5 + 50, 'PAUSED', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setOrigin(0.5, 0.5)

    new ButtonSmall(this, frame.x - frame.displayWidth * 0.5 + 150, frame.y - frame.displayHeight * 0.5 + 200, {
      name: BUTTON.HOME,
      onClick: this.config.onHome,
    }).setOrigin(0.5, 0.5)

    const soundEnabled = isSoundEnabled()
    const soundButton = new ButtonSmall(
      this,
      frame.x - frame.displayWidth * 0.5 + 300,
      frame.y - frame.displayHeight * 0.5 + 200,
      {
        name: BUTTON.SOUND,
        prefix: soundEnabled ? BUTTON_PREFIX_EXTRA.INACTIVE : BUTTON_PREFIX.NORMAL,
        onClick: () => {
          const soundEnabled = isSoundEnabled()
          const newSoundEnabled = !soundEnabled
          setSoundEnabled(newSoundEnabled)
          changeSoundState(this, newSoundEnabled)

          if (newSoundEnabled) {
            soundButton.changeTexture(BUTTON_PREFIX_EXTRA.INACTIVE)
            this.sound.resumeAll()
          } else {
            soundButton.changeTexture(BUTTON_PREFIX.NORMAL)
            this.sound.pauseAll()
          }
        },
      }
    ).setOrigin(0.5, 0.5)

    new ButtonBig(this, frame.x - 5, frame.y - frame.displayHeight * 0.5 + 350, {
      scale: {
        x: 0.6,
        y: 0.6,
      },
      text: {
        title: 'RESUME',
        fontSize: '46px',
        padding: {
          x: 30,
          y: 10,
        },
      },
      onClick: this.config.onResume,
    }).setOrigin(0.5, 0.5)

    new ButtonBig(this, frame.x - 5, frame.y - frame.displayHeight * 0.5 + 480, {
      scale: {
        x: 0.6,
        y: 0.6,
      },
      text: {
        title: 'RESTART',
        fontSize: '46px',
        padding: {
          x: 20,
          y: 10,
        },
      },
      onClick: this.config.onRestart,
    }).setOrigin(0.5, 0.5)
  }
}
