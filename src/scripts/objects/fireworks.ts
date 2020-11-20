import { FIREWORK_HAS_BEEN_RELEASE } from '../events/events'
import { OBJECT_DEPTHS } from '../utils/constants'

export default class Firework extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'firework')
    this.setVisible(false)
    scene.add.existing(this)
    this.setScale(4).setDepth(OBJECT_DEPTHS.FIREWORKS)
  }

  show = async () => {
    this.play('throw', true)
    this.scene.events.emit(FIREWORK_HAS_BEEN_RELEASE, this)
    return Promise.resolve()
  }
}
