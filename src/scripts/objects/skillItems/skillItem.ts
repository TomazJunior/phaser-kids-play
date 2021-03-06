import { SKILL_ITEM_ACTION_DONE, SKILL_ITEM_SELECTED } from '../../events/events'
import { ButtonCircle } from '../../ui/buttonCircle'
import { getSkillItemDefinition, SKILL_ITEM_SKINS, SKILL_ITEM_TYPE } from '../../utils/skillItems'

export default abstract class SkillItem {
  protected image?: Phaser.Physics.Arcade.Sprite
  private _enabled: boolean = false
  private _selected: boolean = false
  private _quantity: number = 0
  private shadow: Phaser.GameObjects.Image
  private badge?: ButtonCircle

  public readonly skillItemDefinition: SkillItemDefinition

  constructor(protected scene: Phaser.Scene, skin: SKILL_ITEM_SKINS) {
    this.skillItemDefinition = getSkillItemDefinition(skin)
  }

  protected abstract doAction: () => Promise<void>

  public process = async () => {
    this._enabled = false
    await this.doAction()
    this._enabled = true
    this.selected = false
    this.scene.events.emit(SKILL_ITEM_ACTION_DONE, this)
  }

  public static readonly skin: SKILL_ITEM_SKINS

  public set selected(v: boolean) {
    if (v && !this.enabled) return

    this._selected = v
    this.shadow.setVisible(v)

    if (this.selected) this.scene.events.emit(SKILL_ITEM_SELECTED, this)

    if (this.selected && this.skillItemDefinition.type === SKILL_ITEM_TYPE.SELECT_NONE) {
      this.scene.time.delayedCall(100, async () => {
        await this.process()
      })
    }
  }

  public get selected(): boolean {
    return this._selected
  }

  public get enabled(): boolean {
    return this._enabled
  }

  public set enabled(v: boolean) {
    this._enabled = v
    const { skin } = this.skillItemDefinition
    if (v) {
      this.image?.setTexture(skin)
    } else {
      this.selected = false
      this.image?.setTexture(`${skin}-inactive`)
    }
  }

  public decreaseThumbnail = (quantity: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!this.badge) return resolve()

      this.scene.tweens.addCounter({
        from: this._quantity,
        to: quantity,
        duration: 250,
        onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
          this.badge!.text = Math.trunc(value).toString()
        },
        onComplete: () => {
          this.badge!.text = quantity.toString()
          this._quantity = quantity
          resolve()
        },
      })
    })
  }

  public addThumbnail = (x: number, y: number, quantity: number) => {
    const { skin } = this.skillItemDefinition
    this._quantity = quantity

    this.shadow = this.scene.add.image(x, y, 'skill-item-spot-shadow').setVisible(false)
    this.image = this.scene.physics.add
      .sprite(x, y, skin)
      .setScale(0.9)
      .setBodySize(100, 80)
      .setInteractive()
      .on('pointerdown', () => {
        this.selected = !this.selected
      })

    this.badge = new ButtonCircle(this.scene, x - 30, y - 30, 'circle-green', quantity.toString()).setScale(0.8)
  }

  public hideThumbnail = (): Promise<void> => {
    if (!this.image) return Promise.resolve()
    this.shadow.setVisible(false)
    this.enabled = false
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: [this.image, this.badge],
        duration: 500,
        alpha: 0,
        onComplete: () => {
          this.shadow.destroy(true)
          this.image?.destroy(true)
          this.image = undefined
          this.badge?.destroy(true)
          this.badge = undefined
          resolve()
        },
      })
    })
  }
}
