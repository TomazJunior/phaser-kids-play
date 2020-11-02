import { PLAYER_TOUCHED_TARGET } from '../events/events'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, FONTS, IMAGE_NAME, SOUNDS, SPRITE_NAME } from '../utils/constants'

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
  tileConfigGameWorld: TileConfigGameWorld
  queuePositionText: Phaser.GameObjects.Text
  clickOnTargetAudio: Phaser.Sound.BaseSound

  constructor(
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    container: Phaser.Physics.Arcade.StaticGroup,
    tileConfigGameWorld: TileConfigGameWorld,
    tileGameWorld: TileGameWorld | undefined,
    texture: string | Phaser.Textures.Texture,
    public readonly id: number,
    frame?: string | integer
  ) {
    super(scene, objectPosition.x, objectPosition.y, texture, frame)
    scene.add.existing(this)
    container.add(this)

    if (tileGameWorld?.angle) {
      this.setAngle(tileGameWorld?.angle)
    }
    this.setScale(tileConfigGameWorld.scale, tileConfigGameWorld.scale)
    this.setSize(tileConfigGameWorld.width, tileConfigGameWorld.height)

    this.objectPosition = objectPosition
    this.tileConfigGameWorld = tileConfigGameWorld
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

    this.queuePositionText = this.createQueuePosition()

    this.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.emit(PLAYER_TOUCHED_TARGET, this)
    })

    this.clickOnWrongBoxAudio = getOrAddAudio(scene, SOUNDS.WRONG_TARGET)
    this.clickOnRightBoxAudio = getOrAddAudio(scene, SOUNDS.FIND_HIDDEN)
    this.clickOnTargetAudio = getOrAddAudio(scene, SOUNDS.CLICK_TARGET)
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
    this.hideQueuePosition()
  }

  public showQueuePosition(position: number) {
    this.shadow.setVisible(true)
    playSound(this.scene, this.clickOnTargetAudio)
    this.queuePositionText.setText(position.toString()).setVisible(true)
  }

  public hideQueuePosition() {
    this.shadow.setVisible(false)
    this.queuePositionText.setText('').setVisible(false)
  }

  protected abstract createShadow(x: number, y: number): Phaser.GameObjects.Sprite

  public abstract close()

  public abstract openTarget(withSound: boolean)

  public abstract isRightTarget(skin: ANIMAL_SKINS | null): boolean

  public abstract wrongTarget()

  private createQueuePosition() {
    return this.scene.add
      .text(this.x, this.y - 15, '', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '64px',
      })
      .setVisible(false)
      .setOrigin(0.5, 0)
  }
}
