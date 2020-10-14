import { ANIMAL_SKINS, SPRITE_NAME } from '../utils/constants'
import { getSkin } from '../utils/skinUtils'
export default class HiddenThumbChars extends Phaser.GameObjects.Container {
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
  }

  clear() {
    this.group.clear(true, true)
  }

  getCurrentHiddenChar(): ANIMAL_SKINS | null {
    const found = this.group
      .getChildren()
      .find((hiddenChar: any) => hiddenChar.visible)

      if (!found) return null
      return getSkin((<Phaser.GameObjects.Sprite>found).frame.name)
  }

  moveToNext(skin: ANIMAL_SKINS) {
    this.group.getChildren().forEach((hiddenChar: any) => {

      const shouldDisapear = hiddenChar.frame.name === skin
      if (shouldDisapear) {
        this.scene.tweens.add({
          targets: hiddenChar,
          ease: 'Cubic.easeOut',
          alpha: 0,
          duration: 1000,
          onComplete: (tween: Phaser.Tweens.Tween, targets: any[]) => {
            targets.forEach(target => target.setVisible(false))
          }
        })
      } else {
        this.scene.tweens.add({
          targets: hiddenChar,
          x: `+=${this.offset}`,
          duration: 1000
        })
      }
      console.log('hiddenChar after', hiddenChar.x)
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
