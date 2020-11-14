import SkillItemFrame from '../objects/skillItemFrame'
import { SkillItemList } from '../objects/skillItemList'
import BackgroundParallax from '../ui/backgroundParallax'
import { BUTTON, SCENES } from '../utils/constants'
import { GemScore } from '../ui/gemScore'
import SkillItem from '../objects/skillItems/skillItem'
import { FrameBig } from '../ui/frameBIg'
import { SkillItemBuyFrame } from '../objects/skillItemBuyFrame'
import { getGems } from '../utils/fileStorage'
import { ButtonSmall } from '../ui/buttonSmall'

export default class SelectItemsScene extends Phaser.Scene {
  private background: BackgroundParallax
  private frame: FrameBig<SkillItemFrame>
  private frameSkillItem: SkillItemBuyFrame
  private gameWorld: GameWorld
  private level: Level
  private gemScore: GemScore
  private isOpeningItemToBuy: boolean = false

  constructor() {
    super({ key: SCENES.SELECT_ITEMS_SCENE })
  }

  create() {
    this.background = new BackgroundParallax(this, false, false)
    this.createSelectSkillItemFrame()
    this.gemScore = new GemScore(this, 150).setVisible(true)

    this.createBackButton()
    this.createGoToLevelButton()
  }

  init(config: CurrentWorldAndLevelConfig) {
    this.gameWorld = config.gameWorld
    this.level = config.level
  }

  createGoToLevelButton() {
    const { width, height } = this.scale
    new ButtonSmall(this, width * 0.5 + 270, height * 0.5 + 170, {
      name: BUTTON.RIGHT,
      onClick: () => {
        this.scene.stop(SCENES.SELECT_ITEMS_SCENE)
        this.scene.start(SCENES.MAIN_SCENE, <CurrentWorldAndLevelConfig>{
          gameWorld: this.gameWorld,
          level: this.level,
        })
      },
    })
  }

  createBackButton() {
    new ButtonSmall(this, 50, 50, {
      name: BUTTON.LEFT,
      onClick: () => {
        this.scene.start(SCENES.LEVEL_SCENE, this.gameWorld)
      },
    }).setOrigin(0.5, 0.5)
  }

  createBuySkillItemFrame(skillItem: SkillItem): Promise<void> {
    const { width } = this.scale
    const { skillItemDefinition } = skillItem
    // start position is outside of the screen
    this.frameSkillItem = new SkillItemBuyFrame(this, width * 0.5, -300, skillItem, {
      title: skillItemDefinition.title,
      visible: false,
      gems: getGems(),
      onCloseButton: this.handleHideBuySkillItemFrame,
      onConfirmButton: this.handleBuySkillItemFrame,
    })
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.frameSkillItem.getChildren(),
        duration: 500,
        y: '+=655',
        onComplete: () => {
          resolve()
        },
      })
    })
  }

  handleBuySkillItemFrame = (): Promise<void> => {
    //TODO: implement buy item
    return Promise.resolve()
  }

  handleHideBuySkillItemFrame = (): Promise<any> => {
    return Promise.all([
      this.gemScore.hide(),
      new Promise((resolve) => {
        this.tweens.add({
          targets: this.frameSkillItem.getChildren(),
          duration: 500,
          y: '-=655',
          onComplete: async () => {
            this.frameSkillItem.setVisible(false)
            resolve()
          },
        })
      }),
    ])
  }

  createSelectSkillItemFrame() {
    const { width, height } = this.scale
    this.frame = new FrameBig<SkillItemFrame>(this, width * 0.5, height * 0.5, {
      visible: true,
      subTitle: `${this.gameWorld.name} - Level ${this.level.level}`,
      title: 'Select boosters',
    })

    const cards = SkillItemList.skills.map((skillItem, index) => {
      return this.frame.addItem((x, y) => {
        return new SkillItemFrame(
          this,
          x,
          y,
          skillItem.skin,
          index === 1 ? 2 : 0,
          new skillItem.clazz(this),
          this.handleBuyItem
        )
      })
    })
  }

  handleBuyItem = (skillItem: SkillItem) => {
    if (this.isOpeningItemToBuy) return

    this.isOpeningItemToBuy = true
    Promise.all([this.gemScore.show(), this.createBuySkillItemFrame(skillItem)]).finally(
      () => (this.isOpeningItemToBuy = false)
    )
  }
}
