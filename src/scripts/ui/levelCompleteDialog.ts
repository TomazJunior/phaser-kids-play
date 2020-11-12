import { getOrAddAudio, playSound } from '../utils/audioUtil'
import {
  BEST_TIME_BY_BOX_IN_SEC,
  BUTTON,
  BUTTON_PREFIX,
  COLORS,
  FONTS,
  MINIMUM_ROUNDS_TO_GAIN_ONE_STAR,
  OBJECT_DEPTHS,
  SOUNDS,
} from '../utils/constants'
import { getLevelStorage, incPlayerGems, setLevelStorage } from '../utils/fileStorage'
import { calculateGems, calculateStars, getStarImageName } from '../utils/scoresUtil'
import { getLevel, getNextLevel } from '../utils/worldUtil'
import { ButtonSmall } from './buttonSmall'

export class LevelCompleteDialog extends Phaser.GameObjects.Sprite {
  private nextLevelAudio: Phaser.Sound.BaseSound
  private group: Phaser.Physics.Arcade.StaticGroup
  private starsImage: Phaser.GameObjects.Image
  private background: Phaser.GameObjects.Rectangle
  private textGems: Phaser.GameObjects.Text
  private listOftweens: Array<Phaser.Tweens.Tween> = []
  private currentLevelStorage: LevelFileStorageConfig | undefined
  private _forceCompleteTweens: boolean

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
    private onGoToLevelScene: () => void
  ) {
    super(scene, x, y, 'level-complete-dialog')
    scene.add.existing(this)
    this.setInteractive().on('pointerdown', () => (this.forceCompleteTweens = true))

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

    this.starsImage = this.scene.add.image(this.x, this.y - 100, 'stars-zero').setScale(0.5, 0.5)

    const gemsTitle = this.scene.add
      .text(this.x + this.width * 0.5 - 290, this.y + 105, 'gems', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
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

    this.currentLevelStorage = getLevelStorage(this.level.level, this.gameworld.key)

    setLevelStorage({ level: this.level.level, stars: this.stars, key: this.gameworld.key })
    incPlayerGems(this.gems)

    this.addRoundText().then(async () => {
      await this.addStarsBasedOnRounds()
      await this.addTimerByRound()
      await this.addStarsBasedOnTimer()
      await this.showGems()
      this.isRoundPassed(this.level.rounds) && playSound(this.scene, this.nextLevelAudio)
      if (this.currentLevelStorage?.stars !== 3 && this.stars !== 3) this.showTryAgainMessage()
    })

    const recordStarTitle = this.scene.add
      .text(gemsTitle.x, this.y - 5, 'record', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)

    const recordStarText = this.scene.add
      .text(this.textGems.x - 15, recordStarTitle.y + 45, `${this.currentLevelStorage?.stars || 0} / 3`, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)

    this.group
      .add(this)
      .add(textTitle)
      .add(gemsTitle)
      .add(this.textGems)
      .add(this.starsImage)
      .add(recordStarTitle)
      .add(recordStarText)
      .setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
  }

  addButtons = (): void => {
    const currentLevel = { ...this.level }
    const nextLevel = getNextLevel(this.gameworld, currentLevel.level)
    const ableToGoNextLevel = this.finishedRounds >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR && !!nextLevel

    const restartButtonConfig: ButtonConfig = {
      name: BUTTON.RESTART,
      onClick: () => this.onRestartScene(this.gameworld, this.level),
    }
    const nextLevelButtonConfig: ButtonConfig = {
      name: BUTTON.RIGHT,
      prefix: ableToGoNextLevel ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      onClick: () => {
        if (ableToGoNextLevel && nextLevel) {
          this.onRestartScene(nextLevel.gameWorld, getLevel(nextLevel.gameWorld.levels, nextLevel.level))
        }
      },
    }

    const levelSceneButtonConfig: ButtonConfig = {
      name: BUTTON.LEVEL,
      onClick: this.onGoToLevelScene,
    }

    const buttonY = this.y + this.height * 0.5 - 70
    const levelSceneButton = new ButtonSmall(
      this.scene,
      this.x - this.displayWidth * 0.4 + 40,
      buttonY,
      levelSceneButtonConfig
    ).setOrigin(0, 0)

    const restartSceneButton = new ButtonSmall(this.scene, this.x - 50, buttonY, restartButtonConfig).setOrigin(0, 0)

    const nextLevelButton = new ButtonSmall(
      this.scene,
      this.x + this.displayWidth * 0.2,
      buttonY,
      nextLevelButtonConfig
    ).setOrigin(0, 0)

    this.group.add(levelSceneButton).add(restartSceneButton).add(nextLevelButton).setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
  }

  addRoundText = async (): Promise<void> => {
    const updateRoundText = async (index) => {
      return new Promise((resolve) => {
        const delay = this.forceCompleteTweens ? 0 : this.DELAY
        this.scene.time.delayedCall(delay, () => {
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
          this.group.add(text).add(imgChecker).setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
          resolve()
        })
      })
    }

    for (let index = 0; index < this.level.rounds; index++) {
      await updateRoundText(index)
    }
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
        this.group.add(timerText).setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
        if (timerInSeconds) {
          const tween = this.scene.tweens.addCounter({
            from: 0,
            to: timerInSeconds,
            duration: this.forceCompleteTweens ? 0 : 500,
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

  private updateStarsImage = async (numberOfStars: number, delay: number) => {
    return new Promise((resolve) => {
      this.scene.time.delayedCall(delay, () => {
        const starImageName = getStarImageName(numberOfStars)
        this.starsImage.setTexture(starImageName)

        resolve()
      })
    })
  }

  addStarsBasedOnRounds = async (): Promise<void> => {
    const maxStars = Math.min(2, this.stars)
    // add star by star
    for (let index = 1; index <= maxStars; index++) {
      const delay = this.forceCompleteTweens ? 0 : this.DELAY * index
      await this.updateStarsImage(index, delay)
    }
  }

  addStarsBasedOnTimer = async (): Promise<void> => {
    // do not add the third star if the rounds was not perfect
    if (this.stars !== 3) return

    this.starsImage.setTexture('stars-three')

    // TODO: add animation / sound
    return Promise.resolve()
  }

  showGems = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // TODO: check if it is the first time
      const duration = this.forceCompleteTweens ? 0 : 1000

      const tween = this.scene.tweens.addCounter({
        from: 0,
        to: this.gems,
        duration,
        onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
          this.textGems.text = Math.trunc(value).toFixed(0)
        },
        onComplete: () => {
          this.textGems.text = this.gems.toString()
          resolve()
        },
      })
      this.listOftweens.push(tween)
    })
  }

  showTryAgainMessage = (): void => {
    const tryAgainTitle = this.scene.add
      .text(
        this.starsImage.x,
        this.starsImage.y + this.starsImage.displayHeight - 25,
        'try again to get all stars and collect more gems',
        {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '18px',
        }
      )
      .setStroke(COLORS.DARK_YELLOW, 10)
      .setOrigin(0.5, 1)
    this.group.add(tryAgainTitle).setDepth(OBJECT_DEPTHS.FRAME_DIALOG)

    const tween = this.scene.tweens.add({
      targets: tryAgainTitle,
      scale: 1.1,
      duration: this.forceCompleteTweens ? 0 : 500,
      repeat: -1,
      yoyo: true,
      onComplete: () => {
        tryAgainTitle.setScale(1, 1)
      },
    })
    this.listOftweens.push(tween)
  }

  createBackground = () => {
    const { width, height } = this.scene.scale
    this.background = this.scene.add.rectangle(width * 0.5, height * 0.5, 500, 500, 0x00000).setInteractive()
    this.background.setAlpha(0.5)
    let scaleX = width / this.background.width
    let scaleY = height / this.background.height
    let scale = Math.max(scaleX, scaleY)
    this.background.setScale(scale).setScrollFactor(0)
    this.background.setDepth(OBJECT_DEPTHS.BACKGROUND)
  }

  private get stars(): number {
    let value = calculateStars(this.finishedRounds)
    const beatTheBestTime = this.timers.every(
      (timerInSeconds: number | undefined, index: number) =>
        this.isRoundPassed(index) && this.isBeatTheBestTime(timerInSeconds)
    )
    if (value === 2 && beatTheBestTime) {
      value++
    }
    return value
  }

  private get forceCompleteTweens(): boolean {
    return this._forceCompleteTweens
  }

  private set forceCompleteTweens(v: boolean) {
    this.listOftweens.forEach((tween) => {
      tween.isPlaying() && tween.complete()
    })
    this._forceCompleteTweens = v
  }

  private get gems(): number {
    return calculateGems(this.stars, this.currentLevelStorage)
  }

  private isRoundPassed = (currentRound: number) => {
    return this.finishedRounds > currentRound
  }
  private isBeatTheBestTime = (timerInSeconds: number | undefined): boolean => {
    return !!timerInSeconds && timerInSeconds <= this.BEST_TIME_IN_SECS
  }
}
