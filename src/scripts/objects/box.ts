import { PLAYER_TOUCHED_BOX } from '../events/events'
import { ANIMAL_SKINS, BOX, IMAGE_NAME, SPRITE_NAME } from '../utils/constants'

export default class Box extends Phaser.Physics.Arcade.Sprite {
  hiddenCharName: ANIMAL_SKINS | null
  opened = true
  border: Phaser.GameObjects.Image
  fingerPoint: Phaser.GameObjects.Image
  borderTween: Phaser.Tweens.Tween
  clickOnWrongBoxAudio: Phaser.Sound.BaseSound
  clickOnRightBoxAudio: Phaser.Sound.BaseSound
  shadow: Phaser.GameObjects.Sprite
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    container: Phaser.Physics.Arcade.StaticGroup
  ) {
    super(scene, x, y, BOX.SKINS.OPENED)
    container.add(this)

    this.shadow = scene.add.sprite(x, y,  BOX.SKINS.CLOSED).setScale(1.2).setTint(0x000000).setAlpha(0.6).setVisible(false)
    
    this.setBodySize(BOX.width, 35)
    this.setOffset(0, 135)

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
    this.openBox(false)
    this.hiddenCharName = name
  }

  reset() {
    this.hiddenCharName = null
    this.close()
  }

  close() {
    this.shadow.setVisible(false)
    if (!this.opened) return

    this.opened = false
    this.setTexture( BOX.SKINS.CLOSED)
  }

  isSelected() {
    this.opened = false
    this.shadow.setVisible(true)
  }

  wrongBox() {
    this.clickOnWrongBoxAudio.play()
    this.opened = false
    this.shadow.setVisible(true)
  }

  openBox(withSound = true) {
    withSound && this.clickOnRightBoxAudio.play()
    this.opened = true
    this.setTexture( BOX.SKINS.OPENED)
  }

  isRightBox(skin: ANIMAL_SKINS | null): boolean {
    return skin === this.hiddenCharName
  }
}
