import { PLAYER_TOUCHED_BOX } from '../events/events'
import { ANIMAL_SKINS, BOX, IMAGE_NAME, SPRITE_NAME } from '../utils/constants'

export default class Box extends Phaser.Physics.Arcade.Sprite {
  hiddenCharName: ANIMAL_SKINS | null
  opened = false
  border: Phaser.GameObjects.Image
  fingerPoint: Phaser.GameObjects.Image
  borderTween: Phaser.Tweens.Tween
  clickOnWrongBoxAudio: Phaser.Sound.BaseSound
  clickOnRightBoxAudio: Phaser.Sound.BaseSound

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

    this.fingerPoint = scene.add.image(x, y, IMAGE_NAME.FINGER_POINT).setScale(0.3).setOrigin(1, 0.3).setVisible(false)

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

    this.clickOnWrongBoxAudio = scene.sound.get('wrong-box') || scene.sound.add('wrong-box')
    this.clickOnRightBoxAudio = scene.sound.get('find-hidden') || scene.sound.add('find-hidden')
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

  setHiddenCharName(name: ANIMAL_SKINS | null) {
    this.hiddenCharName = name
  }

  reset() {
    this.hiddenCharName = null
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

  wrongBox() {
    this.clickOnWrongBoxAudio.play()
    this.opened = false
    this.setFrame(BOX.SKINS.WRONG)
  }

  openBox() {
    this.clickOnRightBoxAudio.play()
    this.opened = true
    this.setFrame(BOX.SKINS.RIGHT)
  }

  isRightBox(skin: ANIMAL_SKINS | null): boolean {
    return skin === this.hiddenCharName
  }
}
