import { ButtonCircle } from '../ui/buttonCircle'

import { SKILL_ITEM_SKINS } from '../utils/skillItems'
import SkillItem from './skillItems/skillItem'

export default class SkillItemFrame extends Phaser.GameObjects.Image {
  private _quantity: number = 0
  private _selected: boolean = false
  private addButton: ButtonCircle
  private quantityButton: ButtonCircle
  private selectButton: ButtonCircle

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    skin: SKILL_ITEM_SKINS,
    quantity: number,
    private skillItem: SkillItem,
    private onAddClick: (skillItem: SkillItem) => void
  ) {
    super(scene, x, y, 'frame-skill-item')
    this.scene.add.existing(this)

    this.quantity = quantity
    const cardImage = scene.add.image(this.x, this.y, skin)
    this.addButton = new ButtonCircle(scene, this.x + 25, this.y + 60, 'circle-blue', '+', this.handleAddClick)
    this.selectButton = new ButtonCircle(
      scene,
      this.x + 25,
      this.y + 60,
      'circle-green-checkmark',
      '',
      this.handleSelectClick
    ).setVisible(false)

    this.quantityButton = new ButtonCircle(scene, this.x - 35, this.y - 40, 'circle-red', this.quantity.toString())
  }

  public set quantity(v: number) {
    if (v >= 0 && v <= this.skillItem.skillItemDefinition.maxPerLevel) {
      this._quantity = v
    }

    const isSkillItemFull = v >= this.skillItem.skillItemDefinition.maxPerLevel
    this.addButton?.setVisible(!isSkillItemFull)
    this.selectButton?.setVisible(isSkillItemFull)
    if (!this._quantity) {
      this.selected = false
    }
  }

  public get quantity(): number {
    return this._quantity
  }

  private set selected(v: boolean) {
    this._selected = v
    if (this._selected) {
      this.setTexture('frame-skill-item-selected')
    } else {
      this.setTexture('frame-skill-item')
    }
  }

  handleAddClick = () => {
    this.onAddClick(this.skillItem)
  }

  handleSelectClick = () => {
    this.selected = !this._selected
  }
}
