import { IMAGE_NAME } from '../utils/constants'

export default class FingerPoint extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, IMAGE_NAME.FINGER_POINT)
    scene.add.existing(this)
    this.setScale(0.3).setOrigin(1, 0.3).setVisible(false)
  }
}
