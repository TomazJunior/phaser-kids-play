import SkillItemFrame from '../objects/skillItemFrame'
import { SkillItemList } from '../objects/skillItemList'
import BackgroundParallax from '../ui/backgroundParallax'
import { BUTTON, SCENES } from '../utils/constants'
import { GemScore } from '../ui/gemScore'
import SkillItem from '../objects/skillItems/skillItem'
import { FrameBig } from '../ui/frameBIg'
import { SkillItemBuyFrame } from '../objects/skillItemBuyFrame'
import {
  buySkillItem,
  getSkillItems,
  getGems,
  removeSkillItems,
  addSkillItemPurchased,
  addSkillItemsUsed,
} from '../utils/gameProgressData'
import { ButtonSmall } from '../ui/buttonSmall'
import { ServiceApi } from '../utils/api'
import { getUserId } from '../utils/gameInfoData'
import { LoadingDialog } from '../ui/loadingDialog'

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
    this.createSkillItemFrames().then(() => {
      this.gemScore = new GemScore(this, 150).setVisible(true)
      this.createBackButton()
      this.createGoToLevelButton()
    })
  }

  init(config: CurrentWorldAndLevelConfig) {
    this.gameWorld = config.gameWorld
    this.level = config.level
  }

  showLoadingDialog = (content: string): LoadingDialog => {
    const { width, height } = this.scale
    return new LoadingDialog(this, width * 0.5, height * 0.5, content, true)
  }

  createGoToLevelButton = () => {
    const { width, height } = this.scale

    new ButtonSmall(this, width * 0.5 + 270, height * 0.5 + 170, {
      name: BUTTON.RIGHT,
      onClick: async () => {
        const selectedSkillItems = this.getSelectedItems()
        await removeSkillItems(selectedSkillItems)
        await this.storeSkillItemUsedInfo(selectedSkillItems)

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

  private createBuySkillItemFrame = async (skillItem: SkillItem): Promise<void> => {
    const { width } = this.scale
    const { skillItemDefinition } = skillItem
    // start position is outside of the screen
    this.frameSkillItem = new SkillItemBuyFrame(this, width * 0.5, -this.HIDDEN_FRAME_START_POSITION, skillItem, {
      title: skillItemDefinition.title,
      visible: false,
      gems: await getGems(),
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
      await this.storeSkillItemInfo(skillItem)
      await buySkillItem(skillItem)
      await this.gemScore.refreshValue()
      this.time.delayedCall(250, async () => {
        await this.refreshAndSelectCard(skillItem)
        await this.handleHideBuySkillItemFrame()
        resolve()
      })
    })
  }

  storeSkillItemInfo = async (skillItem: SkillItemDefinition) => {
    const dialog = this.showLoadingDialog('Storing booster')

    const skillItemPurchased: SkillItemPurchased = {
      skin: skillItem.skin,
      gems: skillItem.itemCost,
      time: new Date().toISOString(),
      quantity: 1,
    }

    const serviceApi = new ServiceApi()
    try {
      await serviceApi.skillItemPurchased(getUserId(), skillItemPurchased)
    } catch (error) {
      // mute error
      await addSkillItemPurchased({ ...skillItemPurchased, sync: false })
    } finally {
      dialog.close()
    }
  }

  storeSkillItemUsedInfo = async (skillItems: Array<SkillItemFileStorageConfig>) => {
    if (!skillItems || !skillItems.length) return Promise.resolve()

    const dialog = this.showLoadingDialog('Loading level')
    const serviceApi = new ServiceApi()

    try {
      await serviceApi.skillItemUsed(getUserId(), skillItems, new Date().toISOString())
    } catch (error) {
      await addSkillItemsUsed(skillItems)
    } finally {
      dialog.close()
    }
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

  createSkillItemFrames = async () => {
    const { width, height } = this.scale
    this.frame = new FrameBig<SkillItemFrame>(this, width * 0.5, height * 0.5, {
      visible: true,
      subTitle: `${this.gameWorld.name} - Level ${this.level.level}`,
      title: 'Select boosters',
    })

    this.cards = SkillItemList.skills.map((skillItem, index) => {
      return this.frame.addItem((x, y) => {
        return new SkillItemFrame(
          this,
          x,
          y,
          skillItem.skin,
          new skillItem.clazz(this),
          this.handleShowBuySkillItemFrame
        )
      })
    })
    await this.refreshCards()
  }

  handleShowBuySkillItemFrame = (skillItem: SkillItem) => {
    if (this.isOpeningItemToBuy) return

    this.backButton.setVisible(false)
    this.isOpeningItemToBuy = true
    Promise.all([this.gemScore.show(), this.createBuySkillItemFrame(skillItem)]).finally(() => {
      this.isOpeningItemToBuy = false
    })
  }

  refreshCards = async () => {
    const skillItems = await getSkillItems()
    if (!skillItems?.length) return
    if (!this.cards?.length) return

    this.cards.forEach((card) => {
      const foundSkillItem = skillItems.find((s) => s.skin === card.skin)
      if (foundSkillItem) {
        card.quantity = foundSkillItem.quantity
      }
    })
  }

  refreshAndSelectCard = async (skillItem: SkillItemDefinition) => {
    const skillItems = await getSkillItems()

    if (!skillItems?.length) return
    if (!this.cards?.length) return

    const card = this.cards.find((card) => card.skin === skillItem.skin)

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
