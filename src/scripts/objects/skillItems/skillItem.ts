import { SKILL_ITEM_SELECTED } from '../../events/events'
import { getSkillItemDefinition, SKILL_ITEM_SKINS } from '../../utils/skillItems'

export default abstract class SkillItem {
  protected image: Phaser.GameObjects.Image
  
  private _selected: boolean = false
  private shadow: Phaser.GameObjects.Sprite

  public readonly skillItemDefinition: SkillItemDefinition
  
  constructor(private scene: Phaser.Scene, skin: SKILL_ITEM_SKINS) {
    this.skillItemDefinition = getSkillItemDefinition(skin)
  }

  public static readonly skin: SKILL_ITEM_SKINS
  abstract doAction: () => Promise<void>
  
  public set selected(v : boolean) {
    this._selected = v;
    this.shadow.setVisible(v)
    this.scene.events.emit(SKILL_ITEM_SELECTED, this)
  }
  
  public get selected() : boolean {
    return this._selected
  }
  
  addThumbnail = (x: number, y: number) => {
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
}
