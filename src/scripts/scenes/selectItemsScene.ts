import SkillItemFrame from '../objects/skillItemFrame'
import { SkillItemList } from '../objects/skillItemList'
import BackgroundParallax from '../ui/backgroundParallax'
import { BUTTON, SCENES } from '../utils/constants'
import { GemScore } from '../ui/gemScore'
import SkillItem from '../objects/skillItems/skillItem'
import { FrameBig } from '../ui/frameBIg'
import { SkillItemBuyFrame } from '../objects/skillItemBuyFrame'
import { buySkillItem, getGameProgressData, getGems, removeSkillItems } from '../utils/gameProgressData'
import { ButtonSmall } from '../ui/buttonSmall'

export default class SelectItemsScene extends Phaser.Scene {
  private background: BackgroundParallax
  private frame: FrameBig<SkillItemFrame>
  private frameSkillItem: SkillItemBuyFrame
  private gameWorld: GameWorld
  private level: Level
  private gemScore: GemScore
  private isOpeningItemToBuy: boolean = false
  private backButton: ButtonSmall
  private HIDDEN_FRAME_START_POSITION = 300
  private cards: Array<SkillItemFrame>

  constructor() {
    super({ key: SCENES.SELECT_ITEMS_SCENE })
  }

  create() {
    this.background = new BackgroundParallax(this, false, false)
    this.createSkillItemFrames()
    this.gemScore = new GemScore(this, 150).setVisible(true)

    this.createBackButton()
    this.createGoToLevelButton()
  }

  init(config: CurrentWorldAndLevelConfig) {
    this.gameWorld = config.gameWorld
    this.level = config.level
  }

  createGoToLevelButton = () => {
    const { width, height } = this.scale

    new ButtonSmall(this, width * 0.5 + 270, height * 0.5 + 170, {
      name: BUTTON.RIGHT,
      onClick: () => {
        const selectedSkillItems = this.getSelectedItems()
        removeSkillItems(selectedSkillItems)

        this.scene.stop(SCENES.SELECT_ITEMS_SCENE)
        this.scene.start(SCENES.MAIN_SCENE, <MainSceneConfig>{
          gameWorld: this.gameWorld,
          level: this.level,
          skillItems: selectedSkillItems,
        })
      },
    })
  }

  createBackButton() {
    this.backButton = new ButtonSmall(this, 50, 50, {
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
    this.frameSkillItem = new SkillItemBuyFrame(this, width * 0.5, -this.HIDDEN_FRAME_START_POSITION, skillItem, {
      title: skillItemDefinition.title,
      visible: false,
      gems: getGems(),
      onCloseButton: this.handleHideBuySkillItemFrame,
      onConfirmButton: this.handleConfirmBuyingSkillItem,
    })
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.frameSkillItem.getChildren(),
        duration: 500,
        y: `+=${this.HIDDEN_FRAME_START_POSITION + this.frame.y}`,
        onComplete: () => {
          resolve()
        },
      })
    })
  }

  handleConfirmBuyingSkillItem = (skillItem: SkillItemDefinition): Promise<void> => {
    return new Promise(async (resolve) => {
      buySkillItem(skillItem)
      await this.gemScore.refreshValue()
      this.time.delayedCall(250, async () => {
        this.refreshAndSelectCard(skillItem)
        await this.handleHideBuySkillItemFrame()
        resolve()
      })
    })
  }

  handleHideBuySkillItemFrame = (): Promise<any> => {
    return Promise.all([
      this.gemScore.hide(),
      new Promise((resolve) => {
        this.tweens.add({
          targets: this.frameSkillItem.getChildren(),
          duration: 500,
          y: `-=${this.HIDDEN_FRAME_START_POSITION + this.frame.y}`,
          onComplete: async () => {
            this.frameSkillItem.setVisible(false)
            resolve()
          },
        })
      }),
    ]).then(() => {
      this.backButton.setVisible(true)
    })
  }

  createSkillItemFrames() {
    const { width, height } = this.scale
    this.frame = new FrameBig<SkillItemFrame>(this, width * 0.5, height * 0.5, {
      visible: true,
      subTitle: `${this.gameWorld.name} - Level ${this.level.level}`,
      title: 'Select boosters',
    })

    this.cards = SkillItemList.skills.map((skillItem, index) => {
      return this.frame.addItem((x, y) => {
        return new SkillItemFrame(this, x, y, skillItem.skin, new skillItem.clazz(this), this.handleShowBuySkillItemFrame)
      })
    })
    this.refreshCards()
  }

  handleShowBuySkillItemFrame = (skillItem: SkillItem) => {
    if (this.isOpeningItemToBuy) return

    this.backButton.setVisible(false)
    this.isOpeningItemToBuy = true
    Promise.all([this.gemScore.show(), this.createBuySkillItemFrame(skillItem)]).finally(() => {
      this.isOpeningItemToBuy = false
    })
  }

  refreshCards = () => {
    const { skillItems } = getGameProgressData()
    if (!skillItems?.length) return
    if (!this.cards?.length) return

    this.cards.forEach((card) => {
      const foundSkillItem = skillItems.find((s) => s.skin === card.skin)
      if (foundSkillItem) {
        card.quantity = foundSkillItem.quantity
      }
    })
  }

  refreshAndSelectCard = (skillItem: SkillItemDefinition) => {
    const { skillItems } = getGameProgressData()

    if (!skillItems?.length) return
    if (!this.cards?.length) return

    const card = this.cards.find(card => card.skin === skillItem.skin)
    
    if (card) {
      const foundSkillItem = skillItems.find((s) => s.skin === card.skin)
      if (foundSkillItem) {
        card.selected = true
        card.quantity = foundSkillItem.quantity
      }
    }
  }

  getSelectedItems = (): Array<SkillItemFileStorageConfig> => {
    return this.cards
      .filter((c) => c.selected)
      .map((c) => {
        return <SkillItemFileStorageConfig>{
          quantity: c.quantity,
          skin: c.skin,
        }
      })
  }
}
