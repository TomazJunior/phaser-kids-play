export default class Door extends Phaser.GameObjects.Group {
  midPart: Phaser.GameObjects.Image
  topPart: Phaser.GameObjects.Image
  objectPosition: ObjectPosition
  _open = false
  constructor(
    scene: Phaser.Scene,
    tileConfigGameWorld: TileConfigGameWorld,
    midDoorPos: ObjectPosition,
    topDoorPos: ObjectPosition
  ) {
    super(scene)

    this.objectPosition = midDoorPos

    this.midPart = scene.add
      .image(midDoorPos.x, midDoorPos.y, 'door-closed-mid')
      .setScale(tileConfigGameWorld.scale, tileConfigGameWorld.scale)
      .setSize(tileConfigGameWorld.width, tileConfigGameWorld.height)
    this.topPart = scene.add
      .image(topDoorPos.x, topDoorPos.y, 'door-closed-top')
      .setScale(tileConfigGameWorld.scale, tileConfigGameWorld.scale)
      .setSize(tileConfigGameWorld.width, tileConfigGameWorld.height)
  }

  public set open(v: boolean) {
    this._open = v
    this.midPart.setTexture(this._open ? 'door-open-mid' : 'door-closed-mid')
    this.topPart.setTexture(this._open ? 'door-open-top' : 'door-closed-top')
  }

  public get open(): boolean {
    return this._open
  }
}
