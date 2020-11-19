import { StateController } from '../controllers/stateController'
import { SKILL_ITEM_ACTION_DONE, SKILL_ITEM_SELECTED } from '../events/events'
import SkillItem from '../objects/skillItems/skillItem'
import { BUTTON, COLORS, FONTS, MAX_TIMER_DURATION } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'
import RoundIndicator from './roundIndicator'

export class FrameLevel extends Phaser.GameObjects.Sprite {
  private worldText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text
  private rounds: Phaser.GameObjects.Group
  private _round: number = 0
  private _timers: Array<number> = []

  clockText: Phaser.GameObjects.Text
  constructor(scene: Phaser.Scene, x: number, y: number, title: string, level: string, onPause: () => void) {
    super(scene, x, y, 'small-frame-level')
    scene.add.existing(this)

    this.worldText = this.scene.add
      .text(this.x - 25, this.y - 135, title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '28px',
      })
      .setStroke(COLORS.DARK_RED, 10)

    this.levelText = this.scene.add
      .text(this.x - 25, this.worldText.y + this.worldText.displayHeight + 3, level, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '38px',
        color: '#ef7c7f',
      })
      .setStroke(COLORS.DARK_RED, 10)

    new ButtonSmall(scene, this.x - this.displayWidth * 0.3, this.y - 80, {
      onClick: onPause,
      name: BUTTON.PAUSE,
      scale: {
        x: 0.5,
        y: 0.5,
      },
    })

    this.rounds = scene.add.group()
    let offsetX = 0
    for (let index = 0; index < 5; index++) {
      this.rounds.add(new RoundIndicator(scene, this.x + offsetX, this.y + 3).setOrigin(0.5, 0.5))
      offsetX += 35
    }

    this.clockText = this.scene.add
      .text(this.x - this.displayWidth * 0.35, this.y + 3, '0.00', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)
      .setOrigin(0, 0.5)

    this.showSkillItems()
  }

  public set round(v: number) {
    this._round = v
    if (!this.rounds || !this.rounds.children) return

    this.rounds.getChildren().forEach((item: any, index: number) => {
      <RoundIndicator>item.changeState(index + 1 <= this._round - 1)
    })
  }

  public set worldName(v: string) {
    this.worldText.text = v
  }

  public set levelName(v: string) {
    this.levelText.text = v
  }

  public set timer(seconds: number) {
    if (seconds >= MAX_TIMER_DURATION) {
      this.clockText.text = '60.0'
    } else {
      this.clockText.text = seconds.toFixed(2)
    }
  }

  public addTimer(seconds: number) {
    this._timers.push(seconds)
  }

  public clearTimer() {
    this._timers = []
  }

  public get timers(): Array<number> {
    return this._timers
  }

  private handleSelectedSkillItem = (skillItem: SkillItem) => {
    const { skillItemsInScene } = StateController.getInstance()
    if (skillItem.selected) {
      skillItemsInScene
        .map((s) => s.skillItem)
        .filter(
          (skillItem) => skillItem.selected && skillItem.skillItemDefinition.skin !== skillItem.skillItemDefinition.skin
        )
        .forEach((skillItem) => (skillItem.selected = false))
    }
  }

  private handleSkillItemUsed = async (skillItem: SkillItem) => {
    const quantity = StateController.getInstance().decreaseSkillItem(skillItem)
    await skillItem.decreaseThumbnail(quantity)
    if (!quantity) {
      await skillItem.hideThumbnail()
    }
  }

  private showSkillItems = () => {
    const { skillItemsInScene } = StateController.getInstance()
    const itemsOffset = [-125, 0, 125]
    skillItemsInScene.forEach((skillItemInScene, index) => {
      const { skillItem, quantity } = skillItemInScene
      skillItem.addThumbnail(this.x + itemsOffset[index], this.y + 77, quantity)
    })
    this.scene.events.on(SKILL_ITEM_SELECTED, this.handleSelectedSkillItem)
    this.scene.events.on(SKILL_ITEM_ACTION_DONE, this.handleSkillItemUsed)
  }
}
