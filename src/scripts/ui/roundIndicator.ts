import { BUTTON_PREFIX, BUTTON_PREFIX_EXTRA } from '../utils/constants'

export default class RoundIndicator extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'round-indicator-inactive')
    this.setScale(1, 0.9)
    scene.add.existing(this)
  }

  changeState(active: boolean) {
    if (active) {
      this.setTexture(`round-indicator-${BUTTON_PREFIX.NORMAL}`)
    } else {
      this.setTexture(`round-indicator-${BUTTON_PREFIX_EXTRA.INACTIVE}`)
    }
  }
}
