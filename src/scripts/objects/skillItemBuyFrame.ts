import { ButtonBig } from '../ui/buttonBig'
import { FrameBig } from '../ui/frameBIg'
import { BUTTON_PREFIX, COLORS, FONTS } from '../utils/constants'
import SkillItem from './skillItems/skillItem'

export class SkillItemBuyFrame extends Phaser.GameObjects.Group {
  private _buyingItem: boolean = false

  frame: FrameBig<Phaser.GameObjects.GameObject>
  constructor(
    scene: Phaser.Scene,
    private x: number,
    private y: number,
    skillItem: SkillItem,
    config: SkillItemBuyFrameInterface
  ) {
    super(scene)
    scene.add.existing(this)

    this.frame = new FrameBig(scene, x, y, config)
    this.addMultiple(this.frame.getChildren())

    const { description, itemCost } = skillItem.skillItemDefinition

    const image = scene.add.image(this.x, this.y - 50, skillItem.skillItemDefinition.skin).setScale(2)
    this.add(image)

    const skillGemCostImage = scene.add.image(this.x + 225, this.y - 90, 'skill-gem-cost')
    this.add(skillGemCostImage)

    const skillGemCostText = scene.add
      .text(skillGemCostImage.x, skillGemCostImage.y, itemCost.toString(), {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
      })
      .setStroke(COLORS.DARK_YELLOW, 8)
      .setOrigin(0.5, 0.5)
    this.add(skillGemCostText)

    const descriptionText = scene.add
      .text(image.x, image.y + 100, description, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
        align: 'center',
      })
      .setStroke(COLORS.DARK_YELLOW, 8)
      .setOrigin(0.5, 0)
    this.add(descriptionText)

    const hasBalanceToBuy = config.gems >= itemCost

    const confirmButton = new ButtonBig(scene, this.x + 225, this.y + 180, {
      onClick: async () => {
        if (this._buyingItem) return
        
        this._buyingItem = true
        await config.onConfirmButton(skillItem.skillItemDefinition)
        this._buyingItem = false
      },
      prefix: hasBalanceToBuy ? BUTTON_PREFIX.NORMAL : BUTTON_PREFIX.BLOCKED,
      scale: {
        x: 0.4,
        y: 0.4,
      },
      text: {
        title: 'BUY',
        fontSize: '32px',
        padding: {
          x: 80,
          y: 30,
        },
        stroke: hasBalanceToBuy
          ? undefined
          : {
              color: '#999999',
              thickness: 20,
            },
      },
    }).setOrigin(0.5, 1)
    this.addMultiple(confirmButton.getChildren())
  }
}
