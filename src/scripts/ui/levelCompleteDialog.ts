import { getOrAddAudio, playSound } from '../utils/audioUtil'
import {
  BEST_TIME_BY_BOX_IN_SEC,
  BUTTON,
  COLORS,
  FONTS,
  MINIMUM_ROUNDS_TO_GAIN_ONE_STAR,
  SOUNDS,
} from '../utils/constants'
import { setLevel } from '../utils/fileStorage'
import { calculateGems, calculateStars, getStarImageName } from '../utils/scoresUtil'
import { getLevel, getNextLevel } from '../utils/worldUtil'
import { ButtonSmall } from './buttonSmall'

export class LevelCompleteDialog extends Phaser.GameObjects.Sprite {
  private nextLevelAudio: Phaser.Sound.BaseSound
  private group: Phaser.Physics.Arcade.StaticGroup
  private starsImage: Phaser.GameObjects.Image
  private background: Phaser.GameObjects.Rectangle
  private stars: number = 0
  private textGems: Phaser.GameObjects.Text
  private listOftweens: Array<Phaser.Tweens.Tween> = []

  private readonly FIRST_COLUMN_X: number
  private readonly SECOND_COLUMN_X: number
  private readonly INITIAL_Y: number
  private readonly OFFSET_Y: number = 40
  private readonly DELAY: number = 250
  private readonly TOTAL_DELAY: number
  private readonly BEST_TIME_IN_SECS: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private gameworld: GameWorld,
    private level: Level,
    private timers: Array<number | undefined>,
    private finishedRounds: number,
    private onRestartScene: (gameworld: GameWorld, level: Level) => void,
    private onGoToLevelScene: () => void,
    private onGoToMenuScene: () => void
  ) {
    super(scene, x, y, 'level-complete-dialog')
    scene.add.existing(this)
    this.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.listOftweens.forEach((tween) => {
        tween.isPlaying() && tween.complete()
      })
    })

    // set default positions
    this.FIRST_COLUMN_X = this.x - this.width * 0.5 + 80
    this.SECOND_COLUMN_X = this.FIRST_COLUMN_X + 180
    this.INITIAL_Y = this.y + 25
    this.TOTAL_DELAY = this.DELAY + this.DELAY * this.level.rounds
    this.BEST_TIME_IN_SECS = this.level.hiddens * BEST_TIME_BY_BOX_IN_SEC

    this.group = this.scene.physics.add.staticGroup()

    this.nextLevelAudio = getOrAddAudio(scene, SOUNDS.NEXT_LEVEL)

    const title = this.finishedRounds >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR ? 'Level Complete' : 'Oops, Try again!'

    const textTitle = this.scene.add
      .text(this.x - 220, this.y - this.height * 0.5 + 30, title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      })
      .setStroke(COLORS.DARK_RED, 10)

    this.starsImage = this.scene.add.image(this.x, this.y - 80, 'stars-zero').setScale(0.7, 0.7)

    const gemsTitle = this.scene.add
      .text(this.x + this.width * 0.5 - 290, this.y + this.height * 0.5 - 210, 'gems', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '42px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)

    this.textGems = this.scene.add
      .text(this.x + this.width * 0.5 - 200, this.y + this.height * 0.5 - 150, '0', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)
      .setOrigin(0.5, 0)

    this.createBackground()

    this.addButtons()

    this.addRoundText().then(async () => {
      await this.addStarsBasedOnRounds()
      await this.addTimerByRound()
      await this.addStarsBasedOnTimer()
      await this.calculateGems()
      this.isRoundPassed(this.level.rounds) && playSound(this.scene, this.nextLevelAudio)
      setLevel({ level: this.level.level, stars: this.stars, key: this.gameworld.key })
    })

    this.group.add(this).add(textTitle).add(gemsTitle).add(this.textGems).add(this.starsImage).setDepth(20)
  }

  addButtons = (): void => {
    const currentLevel = { ...this.level }
    const nextLevel = getNextLevel(this.gameworld, currentLevel.level)

    const menuButtonConfig: ButtonConfig = {
      name: BUTTON.HOME,
      onClick: this.onGoToMenuScene,
    }
    const restartButtonConfig: ButtonConfig = {
      name: BUTTON.RESTART,
      onClick: () => this.onRestartScene(this.gameworld, this.level),
    }
    const nextLevelButtonConfig: ButtonConfig = {
      name: BUTTON.RIGHT,
      onClick: () => {
        if (!!nextLevel) {
          this.onRestartScene(nextLevel.gameWorld, getLevel(nextLevel.gameWorld.levels, nextLevel.level))
        }
      },
    }
    const levelSceneButtonConfig: ButtonConfig = {
      name: BUTTON.LEVEL,
      onClick: this.onGoToLevelScene,
    }

    let secondButtonConfig: ButtonConfig
    let thirdButtonConfig: ButtonConfig
    const finishedLevel = this.isRoundPassed(this.level.rounds)
    if (finishedLevel) {
      secondButtonConfig = !!nextLevel ? levelSceneButtonConfig : { ...levelSceneButtonConfig, visible: false }
      thirdButtonConfig = !!nextLevel ? nextLevelButtonConfig : levelSceneButtonConfig
    } else {
      secondButtonConfig =
        this.finishedRounds >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR ? restartButtonConfig : levelSceneButtonConfig
      thirdButtonConfig =
        this.finishedRounds >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR ? nextLevelButtonConfig : restartButtonConfig
    }

    const buttonY = this.y + this.height * 0.5 - 70
    const firstButton = new ButtonSmall(
      this.scene,
      this.x - this.displayWidth * 0.4 + 40,
      buttonY,
      menuButtonConfig
    ).setOrigin(0, 0)

    const secondButton = new ButtonSmall(this.scene, this.x - 50, buttonY, secondButtonConfig).setOrigin(0, 0)

    const thridButton = new ButtonSmall(
      this.scene,
      this.x + this.displayWidth * 0.2,
      buttonY,
      thirdButtonConfig
    ).setOrigin(0, 0)

    this.group.add(firstButton).add(secondButton).add(thridButton).setDepth(20)
  }

  addRoundText = async (): Promise<void> => {
    return new Promise((resolve) => {
      for (let index = 0; index < this.level.rounds; index++) {
        this.scene.time.delayedCall(this.DELAY * index, () => {
          const x = this.FIRST_COLUMN_X
          const y = this.INITIAL_Y + index * this.OFFSET_Y
          const text = this.scene.add
            .text(x, y, `Round ${index + 1}`, {
              fontFamily: FONTS.ALLOY_INK,
              fontSize: '24px',
            })
            .setStroke(COLORS.DARK_YELLOW, 10)

          const imgChecker = this.scene.add
            .image(text.x + text.width, y, this.isRoundPassed(index) ? 'icon-checked' : 'icon-x')
            .setScale(0.5, 0.5)
            .setOrigin(0, 0)
          this.group.add(text).add(imgChecker).setDepth(20)
        })
      }

      this.scene.time.delayedCall(this.TOTAL_DELAY, () => {
        resolve()
      })
    })
  }

  addTimerByRound = async (): Promise<void> => {
    const updateTimerText = async (index) => {
      return new Promise((resolve) => {
        const y = this.INITIAL_Y + index * this.OFFSET_Y
        const timerInSeconds = index > this.timers.length || !this.isRoundPassed(index) ? undefined : this.timers[index]

        const timerText = this.scene.add.text(this.SECOND_COLUMN_X, y, timerInSeconds ? '0 sec' : ' - ', {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '24px',
        })
        this.group.add(timerText).setDepth(20)
        if (timerInSeconds) {
          const tween = this.scene.tweens.addCounter({
            from: 0,
            to: timerInSeconds,
            duration: 500,
            onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
              timerText.text = value.toFixed(2) + ' sec'
              if (this.isBeatTheBestTime(value)) {
                timerText.setStroke(COLORS.LIGHT_GREEN, 6)
              } else {
                timerText.setStroke(COLORS.DARK_RED, 6)
              }
            },
            onComplete: () => {
              timerText.text = timerInSeconds.toFixed(2) + ' sec'
              if (this.isBeatTheBestTime(timerInSeconds)) {
                timerText.setStroke(COLORS.LIGHT_GREEN, 6)
              } else {
                timerText.setStroke(COLORS.DARK_RED, 6)
              }
              resolve()
            },
          })
          this.listOftweens.push(tween)
        } else {
          resolve()
        }
      })
    }

    for (let index = 0; index < this.level.rounds; index++) {
      await updateTimerText(index)
    }
  }

  addStarsBasedOnRounds = async (): Promise<void> => {
    this.stars = calculateStars(this.finishedRounds)
    console.log('stars', this.stars)
    const starImageName = getStarImageName(this.stars)
    this.starsImage.setTexture(starImageName)

    // TODO: add animation
    return Promise.resolve()
  }

  addStarsBasedOnTimer = async (): Promise<void> => {
    // do not add the third star if the rounds was not perfect
    if (this.stars !== 2) return

    const beatTheBestTime = this.timers.every(
      (timerInSeconds: number | undefined, index: number) =>
        this.isRoundPassed(index) && this.isBeatTheBestTime(timerInSeconds)
    )

    if (beatTheBestTime) {
      this.starsImage.setTexture('stars-three')
      this.stars++
    }

    // TODO: add animation / sound
    return Promise.resolve()
  }

  calculateGems = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // TODO: check if it is the first time
      const firstTime = true

      let gems = calculateGems(this.stars, firstTime)
      let duration = 1000

      const tween = this.scene.tweens.addCounter({
        from: 0,
        to: gems,
        duration,
        onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
          this.textGems.text = Math.trunc(value).toFixed(0)
        },
        onComplete: () => {
          this.textGems.text = gems.toString()
          resolve()
        },
      })
      this.listOftweens.push(tween)
    })
  }

  createBackground = () => {
    const { width, height } = this.scene.scale
    this.background = this.scene.add.rectangle(width * 0.5, height * 0.5, 500, 500, 0x00000).setInteractive()
    this.background.setAlpha(0.5)
    let scaleX = width / this.background.width
    let scaleY = height / this.background.height
    let scale = Math.max(scaleX, scaleY)
    this.background.setScale(scale).setScrollFactor(0)
    this.background.setDepth(18)
  }

  private isRoundPassed = (currentRound: number) => {
    return this.finishedRounds > currentRound
  }
  private isBeatTheBestTime = (timerInSeconds: number | undefined): boolean => {
    return !!timerInSeconds && timerInSeconds <= this.BEST_TIME_IN_SECS
  }
}
