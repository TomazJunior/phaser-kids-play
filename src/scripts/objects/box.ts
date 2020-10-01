import { PLAYER_TOUCHED_BOX } from "../events/events";
import { BOX_SIZE } from "../utils/constants";

export default class Box extends Phaser.Physics.Arcade.Sprite
{
  itemType: number
  hiddenCharName: string
  opened = false
  constructor(scene: Phaser.Scene, x: number, y: number, itemType: number, container: Phaser.Physics.Arcade.StaticGroup, public id: number) {
    super(scene, x, y, 'sokoban', 10);
    this.itemType = itemType;
    container.add(this);
    
    this.setSize(BOX_SIZE.width * BOX_SIZE.scale, BOX_SIZE.height / 1.5);
    this.setScale(BOX_SIZE.scale);
    
    this.setOffset(-32, 54);
        
    scene.add.existing(this)

    this.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.emit(PLAYER_TOUCHED_BOX, this);
    });
  }

  setHiddenCharName(name: string) {
    this.hiddenCharName = name
  }

  reset() {
    this.setFrame(10)
  }

  isSelected() {
    this.setFrame(9)
  }

  isWrongBox() {
    this.setFrame(7)
  }

  isRightBox() {
    this.opened = true
    this.setFrame(8)
  }
}
      