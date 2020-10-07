import { PLAYER_TOUCHED_BOX } from "../events/events";
import { BOX } from "../utils/constants";

export default class Box extends Phaser.Physics.Arcade.Sprite
{
  hiddenCharName: string
  opened = false
  constructor(scene: Phaser.Scene, x: number, y: number, container: Phaser.Physics.Arcade.StaticGroup, public id: number) {
    super(scene, x, y, 'sokoban', BOX.SKINS.DEFAULT);
    container.add(this);
    
    this.setSize(BOX.width * BOX.scale, BOX.height );
    this.setScale(BOX.scale);
    
    this.setOffset(-48, 54);
        
    scene.add.existing(this)

    this.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
      this.emit(PLAYER_TOUCHED_BOX, this);
    });
  }

  setHiddenCharName(name: string) {
    this.hiddenCharName = name
  }

  reset() {
    this.hiddenCharName = ''
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

  isWrongBox() {
    this.opened = false
    this.setFrame(BOX.SKINS.WRONG)
  }

  isRightBox() {
    this.opened = true
    this.setFrame(BOX.SKINS.RIGHT)
  }
}
      