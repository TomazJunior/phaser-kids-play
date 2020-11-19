import { SKILL_ITEM_ACTION_DONE, SKILL_ITEM_SELECTED } from '../../events/events'
import { getSkillItemDefinition, SKILL_ITEM_SKINS } from '../../utils/skillItems'

export default abstract class SkillItem {
  protected image: Phaser.GameObjects.Image
  private _enabled: boolean = false
  private _selected: boolean = false
  private shadow: Phaser.GameObjects.Sprite

  public readonly skillItemDefinition: SkillItemDefinition

  constructor(private scene: Phaser.Scene, skin: SKILL_ITEM_SKINS) {
    this.skillItemDefinition = getSkillItemDefinition(skin)
  }

  protected abstract doAction: () => Promise<void>

  public process = async () => {
    this.enabled = false
    await this.doAction()
    this.scene.events.emit(SKILL_ITEM_ACTION_DONE, this)
  }

  public static readonly skin: SKILL_ITEM_SKINS

  public set selected(v: boolean) {
    if (v && !this.enabled) return

    this._selected = v
    this.shadow.setVisible(v)
    this.scene.events.emit(SKILL_ITEM_SELECTED, this)
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
      this.image.setTexture(skin)
    } else {
      this.selected = false
      this.image.setTexture(`${skin}-inactive`)
    }
  }

  public addThumbnail = (x: number, y: number) => {
    const { skin } = this.skillItemDefinition

    this.shadow = this.scene.add.sprite(x, y, 'skill-item-spot-shadow').setVisible(false)

    this.image = this.scene.add
      .image(x, y, skin)
      .setScale(0.9)
      .setInteractive()
      .on('pointerdown', () => {
        this.selected = !this.selected
      })
  }

  public hideThumbnail = (): Promise<void> => {
    if (!this.image) return Promise.resolve()
    this.shadow.setVisible(false)
    this.enabled = false
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.image,
        duration: 500,
        alpha: 0,
        onComplete: () => {
          this.shadow.destroy(true)
          this.image.destroy(true)
          resolve()
        },
      })
    })
  }
}
