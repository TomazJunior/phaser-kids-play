import { playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, SPRITE_NAME } from '../utils/constants'
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
    super(scene, objectPosition, container, tileConfigGameWorld, tileGameWorld, SPRITE_NAME.SOKOBAN, id, 8)
    this.setBodySize(tileConfigGameWorld.width * tileConfigGameWorld.scale, 52)
    this.setOffset(-18, -15)    
  }

  protected createShadow(x: number, y: number): Phaser.GameObjects.Sprite {
    return this.scene.add
      .sprite(x, y, SPRITE_NAME.SOKOBAN, 6)
      .setSize(64, 64)
      .setScale(this.tileConfigGameWorld.scale + 0.2)
      .setTint(0x000000)
      .setAlpha(0.6)
      .setVisible(false)
  }

  public close() {
    this.shadow.setVisible(false)
    if (!this.opened) return

    this.opened = false
    this.setTexture(SPRITE_NAME.SOKOBAN, 6)
  }

  public isRightTarget(skin: ANIMAL_SKINS | null): boolean {
    return skin === this.hiddenCharName
  }

  public openTarget(withSound: boolean) {
    withSound && playSound(this.scene, this.clickOnRightBoxAudio)
    this.opened = true
    this.setTexture(SPRITE_NAME.SOKOBAN, 8)
  }

  public wrongTarget() {
    playSound(this.scene, this.clickOnWrongBoxAudio)
    this.setTexture(SPRITE_NAME.SOKOBAN, 7)
    this.opened = false
    this.shadow.setVisible(true)
  }
}
