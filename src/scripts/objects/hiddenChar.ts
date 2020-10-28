import { HIDDEN_CHAR_REACHED_TARGET } from '../events/events'
import { ANIMAL_SKINS, SPRITE_NAME } from '../utils/constants'

export default class HiddenChar extends Phaser.Physics.Arcade.Sprite {
  isWalking = false
  isGoingTo: {
    x: number
    y: number
  }
  reachedTarget = false
  target: TargetInterface
  objectPosition: ObjectPosition
  pathToGo: Array<ObjectPosition>

  gotToTheBoxCallback: () => void

  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition, public skin: ANIMAL_SKINS | null) {
    super(scene, objectPosition.x, objectPosition.y, SPRITE_NAME.ROUND_ANIMALS, skin?.toString())
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.objectPosition = objectPosition
    this.setScale(0.5)
    this.setCollideWorldBounds(true)
    this.pathToGo = []

    scene.events.on('update', this.update, this)
  }

  public setIsGoingTo(pathToGo: Array<ObjectPosition>) {
    this.isWalking = true
    this.pathToGo = [...pathToGo]
    this.goToNextPosition()
  }

  private goToNextPosition = () => {
    const moviment = this.pathToGo.shift()

    if (moviment) {
      this.objectPosition = moviment
      this.isGoingTo = {
        x: moviment.x,
        y: moviment.y,
      }
    }
  }

  public goTo(target: TargetInterface, pathToGo: Array<ObjectPosition>) {
    this.target = target
    target.setHiddenCharName(this.skin)
    this.setIsGoingTo(pathToGo)
  }

  update() {
    const speed = 300

    if (!this.isWalking || !this.active) return

    const offset = 10

    let { x, y } = this.isGoingTo
    let distanceX = Math.trunc(x - this.x)
    let distanceY = Math.trunc(y - this.y)

    if (Math.abs(distanceX) < offset) {
      distanceX = 0
    }
    if (Math.abs(distanceY) < offset) {
      distanceY = 0
    }

    if (distanceX === 0 && distanceY === 0) {
      if (this.pathToGo.length) {
        this.goToNextPosition()
      } else {
        this.isWalking = false
        this.setVelocity(0, 0)
        this.setAngle(0)

        this.scene.tweens.add({
          targets: this,
          y: this.target.y,
          x: this.target.x,
          alpha: 1,
          scale: 0,
          duration: 500,
          onComplete: () => {
            this.reachedTarget = true
            this.emit(HIDDEN_CHAR_REACHED_TARGET)
            this.visible = false
          },
        })
        this.emit(HIDDEN_CHAR_REACHED_TARGET)
      }
      return
    }

    const leftDown = distanceX < 0
    const rightDown = distanceX > 0
    const upDown = distanceY < 0
    const downDown = distanceY > 0

    this.angle += 1
    if (leftDown) {
      this.setVelocity(-speed, 0)
    } else if (rightDown) {
      this.setVelocity(speed, 0)
    } else if (upDown) {
      this.setVelocity(0, -speed)
    } else if (downDown) {
      this.setVelocity(0, speed)
    } else {
      this.setVelocity(0, 0)
    }
  }
}
