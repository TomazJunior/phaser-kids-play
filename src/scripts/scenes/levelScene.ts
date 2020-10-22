import { ButtonSmall } from '../ui/buttonSmall'
import { BUTTON, BUTTON_PREFIX, FONTS, LEVELS } from '../utils/constants'
import { getFileStorageConfig } from '../utils/fileStorage'

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' })
  }
  create() {
    this.createBackground()
    this.createSelectLevelFrame()
    this.createBackButton()
  }

  createBackButton() {
    new ButtonSmall(this, 10, 10, {
      name: BUTTON.LEFT,
      onClick: () => {
        this.scene.start('MenuScene')
      },
    }).setOrigin(0, 0)
  }

  createBackground() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)
  }

  //TODO: move to a component UI
  createSelectLevelFrame() {
    const { width, height } = this.scale
    const frame = this.add.image(width * 0.5, height * 0.5, 'big-frame-window')
    const textTitle = this.add
      .text(frame.x - 20, frame.y - frame.displayHeight * 0.5 + 20, 'Select Level', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setOrigin(0.5, 0)

    const initialX = frame.x - frame.displayWidth * 0.5 + 120
    const initialY = frame.y - 80
    let posX = initialX
    let posY = initialY

    const fileStorageData: FileStorageConfig = getFileStorageConfig()

    LEVELS.forEach((level, index) => {
      if (index) {
        posX += 150
      }

      if (posX - initialX > frame.displayWidth - 200) {
        posX = initialX
        posY += 125
      }

      const levelFileData = fileStorageData.levels && fileStorageData.levels.find((lvl) => lvl.level === level.level)
      const maxLevel = fileStorageData.levels.reduce((maxLevel, level) => {
        if (level.stars) {
          maxLevel = Math.max(maxLevel, level.level + 1)
        }
        return maxLevel
      }, 1)

      const button = new ButtonSmall(this, posX, posY, {
        name: BUTTON.EMPTY,
        onClick: () => {
          this.scene.start('MainScene', level)
        },
        text: level.level.toString(),
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
  }
}
