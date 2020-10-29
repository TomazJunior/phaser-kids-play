import { HIDDEN_THUMB_CHAR_MOVED_TO_NEXT } from '../events/events'
import { ANIMAL_SKINS, SPRITE_NAME } from '../utils/constants'
export default class HiddenThumbChars extends Phaser.GameObjects.Container {
  private _currentHiddenChar: ANIMAL_SKINS | null
  scene: Phaser.Scene
  group: Phaser.GameObjects.Group
  border: Phaser.GameObjects.Image
  boardX: number
  offset: number = 80
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    this.scene = scene
    this.group = this.scene.add.group()

    this.boardX = this.offset * 2.5
    this.border = scene.add.image(this.boardX, 0, SPRITE_NAME.SOKOBAN, 39).setScale(1.3).setOrigin(0, 0)

    this.add(this.group.getChildren())
    this.add(this.border)
  }

  createChars(hiddenSkins: ANIMAL_SKINS[]) {
    hiddenSkins.forEach((hiddenSkin: ANIMAL_SKINS, index: number) => {
      this.addHiddenChar(hiddenSkin, index)
    })
    this._currentHiddenChar = hiddenSkins[0]
  }

  clear() {
    this._currentHiddenChar = null
    this.group.clear(true, true)
  }

  public get currentHiddenChar(): ANIMAL_SKINS | null {
    return this._currentHiddenChar
  }

  getHiddenChars(onlyVisible: boolean): Array<ANIMAL_SKINS> {
    return this.group
      .getChildren()
      .filter((hiddenChar: any) => {
        if (onlyVisible) {
          return hiddenChar.visible === true
        } else {
          return true
        }
      })
      .map((hiddenChar: any) => {
        return hiddenChar.frame.name
      })
  }

  moveToNext(skin: ANIMAL_SKINS) {
    const index = this.group.getChildren().findIndex((hiddenChar: any) => hiddenChar.frame.name === skin)
    if (index !== -1 && this.group.getChildren().length > index + 1) {
      this._currentHiddenChar = (<any>this.group.getChildren()[index + 1]).frame.name
    } else {
      this._currentHiddenChar = null
    }

    this.group.getChildren().forEach((hiddenChar: any) => {
      const shouldDisapear = hiddenChar.frame.name === skin
      if (shouldDisapear) {
        this.scene.tweens.add({
          targets: hiddenChar,
          ease: 'Cubic.easeOut',
          alpha: 0,
          duration: 1000,
          onComplete: (tween: Phaser.Tweens.Tween, targets: any[]) => {
            targets.forEach((target) => target.setVisible(false))
            this.emit(HIDDEN_THUMB_CHAR_MOVED_TO_NEXT, {
              previous: skin,
              current: this._currentHiddenChar,
            })
          },
        })
      } else {
        this.scene.tweens.add({
          targets: hiddenChar,
          x: `+=${this.offset}`,
          duration: 500,
        })
      }
    })
  }

  private addHiddenChar(hiddenSkin: ANIMAL_SKINS, index: number) {
    let x = this.boardX + 40
    if (!!index) {
      x += this.offset * -index
    }
    const thumb = this.scene.add.sprite(x, 40, SPRITE_NAME.ROUND_ANIMALS, hiddenSkin).setScale(0.5)

    this.group.add(thumb)
    this.add(thumb)
  }
}
