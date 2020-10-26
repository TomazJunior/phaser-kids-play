import { playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, BOX } from '../utils/constants'
import Target from './target'

export class Chest extends Target {
  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition, container: Phaser.Physics.Arcade.StaticGroup, tileConfigGameWorld: TileConfigGameWorld,) {
    super(scene, objectPosition, container, tileConfigGameWorld, BOX.SKINS.OPENED)
    this.setBodySize(tileConfigGameWorld.width, 35)
    this.setOffset(0, 135)
  }

  protected createShadow(x: number, y: number): Phaser.GameObjects.Sprite {
    return this.scene.add
    .sprite(x, y, BOX.SKINS.CLOSED)
    .setScale(1.2)
    .setTint(0x000000)
    .setAlpha(0.6)
    .setVisible(false)
  }

  public close() {
    this.shadow.setVisible(false)
    if (!this.opened) return

    this.opened = false
    this.setTexture(BOX.SKINS.CLOSED)
  }

  public isRightTarget(skin: ANIMAL_SKINS | null): boolean {
    return skin === this.hiddenCharName
  }

  public openTarget(withSound: boolean) {
    console.log('open target ', withSound)
    withSound && playSound(this.scene, this.clickOnRightBoxAudio)
    this.opened = true
    this.setTexture(BOX.SKINS.OPENED)
  }
}
