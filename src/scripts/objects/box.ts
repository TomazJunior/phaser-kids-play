import { playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, OBJECT_DEPTHS } from '../utils/constants'
import Target from './target'

export class Box extends Target {
  
  constructor(
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    container: Phaser.Physics.Arcade.StaticGroup,
    tileConfigGameWorld: TileConfigGameWorld,
    tileGameWorld: TileGameWorld | undefined,
    id: number
  ) {
    super(scene, objectPosition, container, tileConfigGameWorld, tileGameWorld, 'box-opened', id)
    this.setBodySize(tileConfigGameWorld.width * tileConfigGameWorld.scale, 52)
    this.setOffset(-18, -15)    
  }

  protected createShadow(x: number, y: number): Phaser.GameObjects.Sprite {
    return this.scene.add
      .sprite(x, y, 'box-opened')
      .setSize(64, 64)
      .setScale(this.tileConfigGameWorld.scale + 0.2)
      .setTint(0x000000)
      .setAlpha(0.6)
      .setVisible(false)
      .setDepth(OBJECT_DEPTHS.TARGET_SHADOW)
  }

  public close() {
    if (this.stuck) return
    if (!this.opened) return

    this.opened = false
    this.setTexture('box-closed')
  }

  public isRightTarget(skin: ANIMAL_SKINS | null): boolean {
    return skin === this.hiddenChar?.skin
  }

  public openTarget(withSound: boolean) {
    if (this.stuck) return
    withSound && playSound(this.scene, this.clickOnRightBoxAudio)
    this.opened = true
    this.setTexture('box-opened')
  }

  public wrongTarget() {
    playSound(this.scene, this.clickOnWrongBoxAudio)
    this.opened = false
    this.shadow.setVisible(true)
  }
}
