import Box from "./box";
import { PLAYER_CHAR_REACHED_BOX } from "../events/events";
import { PLAYER } from "../utils/constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  isWalking = false
  isGoingTo: {
    x: number,
    y: number
  }
  activeBox: Box
  animation: string

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    this.setScale(1.5).setOffset(16, 16)
      
    this.setCollideWorldBounds(true)
    this.active = false;
    this.animation = PLAYER.ANIMATIONS.DOWN_IDLE;
    scene.events.on('update', this.update, this)
  }

  goTo(box: Box) {
    if (!this.active) return
    this.isWalking = true
    this.setActiveBox(box)
    this.isGoingTo = {
      x: box.x - box.displayWidth, 
      y: box.y - box.displayHeight / 2, 
    }
  }

  setActiveBox(box: Box) {
    if (this.activeBox) {
      this.activeBox.reset()
    }
    this.activeBox = box
    this.activeBox.isSelected()
  }

  update() {
    this.play(this.animation, true)
    if (!this.active) return
    
    const speed = 200
    // offset to garantee player won't collide up/down with the boxes
    const offset = 10

    if (!this.isWalking) return

    let {x, y} = this.isGoingTo;
    let distanceX = Math.trunc(this.x - x);
    let distanceY = Math.trunc(this.y - y);
    
    if (Math.abs(distanceX) <= offset && Math.abs(distanceY) <= offset) {
      this.isWalking = false
      this.setVelocity(0, 0)
      this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
      this.emit(PLAYER_CHAR_REACHED_BOX, this.activeBox);
      return
    }

    if (this.body.blocked.up || this.body.blocked.down) {
      if (distanceX < 0) {
        this.setVelocity(speed, 0)
        this.animation = PLAYER.ANIMATIONS.RIGHT_WALK
      } else if (distanceX > 0) {
        this.setVelocity(-speed, 0)
        this.animation = PLAYER.ANIMATIONS.LEFT_WALK
      }
      return
    }

    if (Math.abs(distanceY) > 5) {
      if (distanceY > 0) {
        this.setVelocity(0, -speed)
        this.animation = PLAYER.ANIMATIONS.UP_WALK
      } else if (distanceY < 0) {
        this.setVelocity(0, speed)
        this.animation = PLAYER.ANIMATIONS.DOWN_WALK
      }
      return
    }

    if (this.body.blocked.right || this.body.blocked.left) {
      if (distanceY > 0) {
        this.setVelocity(0, -speed)
        this.animation = PLAYER.ANIMATIONS.UP_WALK
      } else if (distanceY < 0) {
        this.setVelocity(0, speed)
        this.animation = PLAYER.ANIMATIONS.DOWN_WALK
      }
      return
    }

    if (Math.abs(distanceX) > 0) {
      if (distanceX < 0) {
        this.setVelocity(speed, 0)
        this.animation = PLAYER.ANIMATIONS.RIGHT_WALK
      } else if (distanceX > 0) {
        this.setVelocity(-speed, 0)
        this.animation = PLAYER.ANIMATIONS.LEFT_WALK
      }
      return
    }
  }
}
