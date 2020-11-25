import { ButtonCircle } from '../ui/buttonCircle'
import { getQuantityOfSkillItems } from '../utils/gameProgressData'

import { SKILL_ITEM_SKINS } from '../utils/skillItems'
import SkillItem from './skillItems/skillItem'

export default class SkillItemFrame extends Phaser.GameObjects.Image {
  private _quantity: number = 0
  private _selected: boolean = false
  private addButton: ButtonCircle
  private minusButton: ButtonCircle
  private quantityButton: ButtonCircle
  private isAdding: boolean = false

  public readonly skin: SKILL_ITEM_SKINS

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    skin: SKILL_ITEM_SKINS,
    private skillItem: SkillItem,
    private onAddClick: (skillItem: SkillItem) => void
  ) {
    super(scene, x, y, 'frame-skill-item')
    this.scene.add.existing(this)

    this.skin = skin
    const cardImage = scene.add.image(this.x, this.y, skin)

    this.addButton = new ButtonCircle(
      scene,
      this.x - 30,
      this.y + 60,
      'circle-blue',
      '+',
      this.handleAddClick
    ).setScale(1.2)
    this.minusButton = new ButtonCircle(
      scene,
      this.x + 30,
      this.y + 60,
      'circle-red',
      '-',
      this.handleMinusClick
    ).setScale(1.2)

    this.quantityButton = new ButtonCircle(scene, this.x - 50, this.y - 50, 'circle-green', '0')
    this.quantity = 0

    this.setInteractive().on('pointerdown', () => {
      if (this.quantity) {
        this.selected = !this.selected
      } else {
        this.handleAddClick(true)
      }
    })
  }

  public set quantity(v: number) {
    if (v < 0) return
    if (v > this.skillItem.skillItemDefinition.maxPerLevel) {
      this._quantity = this.skillItem.skillItemDefinition.maxPerLevel
    } else {
      this._quantity = v
    }
    this.updateAddButtonStyle()
    const isSkillItemFull = v >= this.skillItem.skillItemDefinition.maxPerLevel
    this.quantityButton.text = this._quantity.toString()

    if (isSkillItemFull) {
      this.selected = true
    } else if (!this.quantity) {
      this.selected = false
    }
  }

  public get quantity(): number {
    return this._quantity
  }

  public get selected(): boolean {
    return this._selected
  }

  public set selected(v: boolean) {
    this._selected = v
    if (this._selected) {
      this.setTexture('frame-skill-item-selected')
    } else {
      this.setTexture('frame-skill-item')
    }
  }

  handleMinusClick = () => {
    this.quantity--
  }

  handleAddClick = (selectIfHasItem: boolean = false) => {
    if (this.isAdding) return
    this.isAdding = true
    if (this.addButton?.texture === 'circle-blue') {
      this.quantity++
      if (selectIfHasItem && this.quantity) {
        this.selected = true
      }
    } else if (this.addButton?.texture === 'circle-blue-chart') {
      this.onAddClick(this.skillItem)
    }
    this.isAdding = false
  }

  handleSelectClick = () => {
    this.selected = !this._selected
  }

  updateAddButtonStyle = () => {
    if (!this.addButton) return

    const isSkillItemFull = this.quantity >= this.skillItem.skillItemDefinition.maxPerLevel

    if (isSkillItemFull) {
      this.addButton.texture = 'circle-grey'
      this.addButton.text = '+'
    } else {
      const quantityOfSkillItems = getQuantityOfSkillItems(this.skin)
      const hasMoreItems = quantityOfSkillItems > this._quantity
      if (hasMoreItems) {
        this.addButton.texture = 'circle-blue'
        this.addButton.text = '+'
      } else {
        this.addButton.texture = 'circle-blue-chart'
        this.addButton.text = ''
      }
    }
  }
}
