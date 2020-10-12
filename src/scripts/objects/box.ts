import { PLAYER_TOUCHED_BOX } from '../events/events'
import { BOX, SPRITE_NAME } from '../utils/constants'

export default class Box extends Phaser.Physics.Arcade.Sprite {
  hiddenCharName: string
  opened = false
  border: Phaser.GameObjects.Image
  fingerPoint: Phaser.GameObjects.Image
  borderTween: Phaser.Tweens.Tween

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    container: Phaser.Physics.Arcade.StaticGroup,
    public id: number
  ) {
    super(scene, x, y, SPRITE_NAME.SOKOBAN, BOX.SKINS.DEFAULT)
    container.add(this)

    this.setSize(BOX.width * BOX.scale, BOX.height)
    this.setScale(BOX.scale)

    this.setOffset(-48, 54)

    scene.add.existing(this)

    this.fingerPoint = scene.add.image(x, y, 'finger-point').setScale(0.3).setOrigin(1, 0.3).setVisible(false)

    this.border = scene.add.image(x, y, SPRITE_NAME.SOKOBAN, 39)
    this.border.setScale(BOX.scale + 0.4)
    this.border.visible = false
    this.borderTween = this.scene.tweens.add({
      targets: [this.border],
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 500,
      repeat: -1,
      yoyo: true,
    })
    this.borderTween.pause()

    this.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.emit(PLAYER_TOUCHED_BOX, this)
    })
  }

  toggleHelp() {
    this.border.visible = !this.border.visible
    this.fingerPoint.setVisible(this.border.visible)
    if (this.border.visible) {
      this.borderTween.resume()
    } else {
      this.borderTween.pause()
    }
  }

  setHiddenCharName(name: string) {
    this.hiddenCharName = name
  }

  reset() {
    this.hiddenCharName = ''
    this.close()
  }

  close() {
    this.opened = false
    this.setFrame(BOX.SKINS.DEFAULT)
  }

  isSelected() {
    this.opened = false
    this.setFrame(BOX.SKINS.SELECTED)
  }

  isWrongBox() {
    this.opened = false
    this.setFrame(BOX.SKINS.WRONG)
  }

  isRightBox() {
    this.opened = true
    this.setFrame(BOX.SKINS.RIGHT)
  }
}
