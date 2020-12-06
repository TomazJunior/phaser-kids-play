import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonSmall } from '../ui/buttonSmall'
import { BUTTON, BUTTON_PREFIX, COLORS, FONTS, SCENES } from '../utils/constants'
import { getLevels } from '../utils/gameProgressData'
import { getStarImageName } from '../utils/scoresUtil'
import { allLevelsCompleted, getGameWorld, getNextWorld, getPreviousWorld } from '../utils/worldUtil'

export default class LevelScene extends Phaser.Scene {
  private gameWorld: GameWorld
  private background: BackgroundParallax

  constructor() {
    super({ key: SCENES.LEVEL_SCENE })
  }
  create() {
    this.background = new BackgroundParallax(this, false)
    this.createSelectLevelFrame().then(this.createBackButton)
  }

  init(gameWorld: GameWorld) {
    if (!gameWorld?.key) {
      this.gameWorld = getGameWorld()
    } else {
      this.gameWorld = { ...gameWorld }
    }
  }

  createBackButton = () => {
    new ButtonSmall(this, 50, 50, {
      name: BUTTON.LEFT,
      onClick: () => {
        this.background.close()
        this.scene.stop(SCENES.LEVEL_SCENE)
        this.scene.start(SCENES.MENU_SCENE)
      },
    }).setOrigin(0.5, 0.5)
  }

  createSelectLevelFrame = async (): Promise<void> => {
    const { width, height } = this.scale
    const frame = this.add.image(width * 0.5, height * 0.55, 'big-frame-window')
    const textTitle = this.add
      .text(frame.x - 20, frame.y - frame.displayHeight * 0.5 + 20, this.gameWorld.name, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setStroke(COLORS.DARK_RED, 10)
      .setOrigin(0.5, 0)

    const previousWorld = getPreviousWorld(this.gameWorld)
    const nextWorld = getNextWorld(this.gameWorld)

    const initialX = frame.x - frame.displayWidth * 0.5 + 120
    const initialY = frame.y - 80
    let posX = initialX
    let posY = initialY

    let initialLevel = 1
    if (!!previousWorld) {
      initialLevel = (await allLevelsCompleted(previousWorld)) ? 1 : 0
    }

    const levels = await getLevels()

    this.gameWorld.levels.forEach((level, index) => {
      if (index) {
        posX += 150
      }

      if (posX - initialX > frame.displayWidth - 200) {
        posX = initialX
        posY += 125
      }

      const levelFileData = levels.find((lvl) => lvl.level === level.level && lvl.key === this.gameWorld.key)
      const maxLevel = levels
        .filter((level) => level.key === this.gameWorld.key)
        .reduce((maxLevel, level) => {
          if (level.stars) {
            maxLevel = Math.max(maxLevel, level.level + 1)
          }
          return maxLevel
        }, initialLevel)

      const button = new ButtonSmall(this, posX, posY, {
        name: BUTTON.EMPTY,
        onClick: () => {
          this.background.close()
          this.scene.stop(SCENES.LEVEL_SCENE)
          this.scene.start(SCENES.SELECT_ITEMS_SCENE, <CurrentWorldAndLevelConfig>{
            gameWorld: this.gameWorld,
            level,
          })
        },
        text: {
          title: level.level.toString(),
        },
        prefix: level.level > maxLevel ? BUTTON_PREFIX.BLOCKED : undefined,
        scale: {
          x: 0.6,
          y: 0.6,
        },
      })

      const starImageName = getStarImageName(levelFileData?.stars)
      this.add.image(button.x, button.y + button.displayHeight * 0.35, starImageName).setScale(0.2, 0.2)
    })

    new ButtonSmall(this, initialX - 175, initialY + 125, {
      name: BUTTON.LEFT,
      prefix: !!previousWorld ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      onClick: () => {
        if (previousWorld) {
          this.background.close()
          this.scene.restart(previousWorld)
        }
      },
    })

    const hasNextWorld = !!nextWorld

    new ButtonSmall(this, initialX + 150 * 5 - 50, initialY + 125, {
      name: BUTTON.RIGHT,
      prefix: hasNextWorld ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      onClick: () => {
        if (hasNextWorld) {
          this.background.close()
          this.scene.restart(nextWorld)
        }
      },
    })
  }
}
