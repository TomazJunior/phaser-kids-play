import { PLAYER_TOUCHED_TARGET } from '../events/events'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, BOX, IMAGE_NAME, SOUNDS, SPRITE_NAME } from '../utils/constants'

export default abstract class Target extends Phaser.Physics.Arcade.Sprite implements TargetInterface {
  hiddenCharName: ANIMAL_SKINS | null
  opened = true
  border: Phaser.GameObjects.Image
  fingerPoint: Phaser.GameObjects.Image
  borderTween: Phaser.Tweens.Tween
  clickOnWrongBoxAudio: Phaser.Sound.BaseSound
  clickOnRightBoxAudio: Phaser.Sound.BaseSound
  shadow: Phaser.GameObjects.Sprite
  objectPosition: ObjectPosition
  constructor(
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    container: Phaser.Physics.Arcade.StaticGroup,
    tileConfigGameWorld: TileConfigGameWorld,
    texture: string | Phaser.Textures.Texture,
    frame?: string | integer
  ) {
    super(scene, objectPosition.x, objectPosition.y, texture, frame)
    scene.add.existing(this)
    container.add(this)
    this.objectPosition = objectPosition
    const { x, y } = objectPosition
    this.shadow = this.createShadow(x, y)

    this.fingerPoint = scene.add.image(x, y, IMAGE_NAME.FINGER_POINT).setScale(0.3).setOrigin(1, 0.3).setVisible(false)

    this.border = scene.add.image(x, y, SPRITE_NAME.SOKOBAN, 39)
    this.border.setScale(tileConfigGameWorld.scale + 0.4)
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
      this.emit(PLAYER_TOUCHED_TARGET, this)
    })

    this.clickOnWrongBoxAudio = getOrAddAudio(scene, SOUNDS.WRONG_TARGET)
    this.clickOnRightBoxAudio = getOrAddAudio(scene, SOUNDS.FIND_HIDDEN)
  }

  protected abstract createShadow(x: number, y: number): Phaser.GameObjects.Sprite

  public wrongTarget() {
    playSound(this.scene, this.clickOnWrongBoxAudio)
    this.opened = false
    this.shadow.setVisible(true)
  }

  public toggleHelp(enable: boolean) {
    this.border.visible = enable
    this.fingerPoint.setVisible(this.border.visible)
    if (this.border.visible) {
      if (!this.borderTween.hasStarted) {
        this.borderTween.restart()
      }
      this.borderTween.resume()
    } else {
      this.borderTween.pause()
    }
  }

  public isSelected() {
    this.opened = false
    this.shadow.setVisible(true)
  }

  public setHiddenCharName(name: ANIMAL_SKINS | null) {
    this.openTarget(false)
    this.hiddenCharName = name
  }

  public reset() {
    this.shadow.setVisible(false)
    this.hiddenCharName = null
    this.openTarget(false)
    this.toggleHelp(false)
  }

  public abstract close()

  public abstract openTarget(withSound: boolean)

  public abstract isRightTarget(skin: ANIMAL_SKINS | null): boolean
}
