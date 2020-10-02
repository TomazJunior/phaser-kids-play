import { PLAYER_TOUCHED_BOX } from "../events/events";
import { BOX } from "../utils/constants";

export default class Box extends Phaser.Physics.Arcade.Sprite
{
  itemType: number
  hiddenCharName: string
  opened = false
  constructor(scene: Phaser.Scene, x: number, y: number, itemType: number, container: Phaser.Physics.Arcade.StaticGroup, public id: number) {
    super(scene, x, y, 'sokoban', BOX.SKINS.DEFAULT);
    this.itemType = itemType;
    container.add(this);
    
    this.setSize(BOX.width * BOX.scale, BOX.height / 1.5);
    this.setScale(BOX.scale);
    
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
    this.setFrame(BOX.SKINS.DEFAULT)
  }

  isSelected() {
    this.setFrame(BOX.SKINS.SELECTED)
  }

  isWrongBox() {
    this.setFrame(BOX.SKINS.WRONG)
  }

  isRightBox() {
    this.opened = true
    this.setFrame(BOX.SKINS.RIGHT)
  }
}
      