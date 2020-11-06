import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonSmall } from '../ui/buttonSmall'
import { BUTTON, BUTTON_PREFIX, FONTS, SCENES } from '../utils/constants'
import { getFileStorageConfig } from '../utils/fileStorage'
import { allLevelsCompleted, getGameWorld, getNextWorld, getPreviousWorld } from '../utils/worldUtil'

export default class LevelScene extends Phaser.Scene {
  private gameWorld: GameWorld
  private background: BackgroundParallax

  constructor() {
    super({ key: SCENES.LEVEL_SCENE })
  }
  create() {
    this.background = new BackgroundParallax(this, false)
    this.createSelectLevelFrame()
    this.createBackButton()
  }

  init(gameWorld: GameWorld) {
    if (!gameWorld?.key) {
      this.gameWorld = getGameWorld()
    } else {
      this.gameWorld = { ...gameWorld }
    }
  }

  createBackButton() {
    new ButtonSmall(this, 10, 10, {
      name: BUTTON.LEFT,
      onClick: () => {
        this.scene.start(SCENES.MENU_SCENE)
      },
    }).setOrigin(0, 0)
  }

  createSelectLevelFrame() {
    const { width, height } = this.scale
    const frame = this.add.image(width * 0.5, height * 0.55, 'big-frame-window')
    const textTitle = this.add
      .text(frame.x - 20, frame.y - frame.displayHeight * 0.5 + 20, this.gameWorld.name, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setOrigin(0.5, 0)

    const previousWorld = getPreviousWorld(this.gameWorld)
    const nextWorld = getNextWorld(this.gameWorld)

    const initialX = frame.x - frame.displayWidth * 0.5 + 120
    const initialY = frame.y - 80
    let posX = initialX
    let posY = initialY

    const fileStorageData: FileStorageConfig = getFileStorageConfig()

    let initialLevel = 1
    if (!!previousWorld) {
      initialLevel = allLevelsCompleted(previousWorld) ? 1 : 0
    }
    
    this.gameWorld.levels.forEach((level, index) => {
      if (index) {
        posX += 150
      }

      if (posX - initialX > frame.displayWidth - 200) {
        posX = initialX
        posY += 125
      }

      const levelFileData =
        fileStorageData.levels &&
        fileStorageData.levels.find((lvl) => lvl.level === level.level && lvl.key === this.gameWorld.key)

      const maxLevel = fileStorageData.levels
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
          this.scene.start(SCENES.MAIN_SCENE, <MainSceneConfig>{
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

      //TODO: create constants
      let stars = 'stars-zero'
      if (levelFileData) {
        switch (levelFileData.stars) {
          case 3:
            stars = 'stars-three'
            break
          case 2:
            stars = 'stars-two'
            break
          case 1:
            stars = 'stars-one'
            break
        }
      }
      this.add.image(button.x, button.y + button.displayHeight * 0.35, stars).setScale(0.2, 0.2)
    })

    new ButtonSmall(this, initialX - 175, initialY + 125, {
      name: BUTTON.LEFT,
      prefix: !!previousWorld ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      onClick: () => {
        if (previousWorld) {
          this.scene.restart(previousWorld)
        }
      },
    })

    new ButtonSmall(this, initialX + 150 * 5 - 50, initialY + 125, {
      name: BUTTON.RIGHT,
      prefix: !!nextWorld ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      onClick: () => {
        if (nextWorld) {
          this.scene.restart(nextWorld)
        }
      },
    })
  }
}
