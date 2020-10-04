import Box from "./box";
import { PLAYER_CHAR_REACHED_BOX } from "../events/events";
import { PLAYER } from "../utils/constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  isWalking = false
  isGoingTo: {
    x: number,
    y: number,
    initialPos: false
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
    this.createAnimations()
    this.animation = PLAYER.ANIMATIONS.DOWN_IDLE;
    this.play(this.animation, true)

    scene.events.on('update', this.update, this)
  }

  goTo(box: Box) {
    if (!this.active) return
    this.setActiveBox(box)
    this.setIsGoingTo({
      x: box.x - box.displayWidth, 
      y: box.y - box.displayHeight / 2,
      initialPos: false
    })
  }

  setIsGoingTo(pos: {x, y, initialPos}) {
    this.isWalking = true
    this.isGoingTo = pos
  }

  setActiveBox(box: Box) {
    if (this.activeBox) {
      this.activeBox.close()
    }
    this.activeBox = box
    this.activeBox.isSelected()
  }

  update() {
    if (!this.active) return
    this.play(this.animation, true)
    
    const speed = 350
    // offset to garantee player won't collide up/down with the boxes
    const offset = 10

    if (!this.isWalking) return

    let {x, y, initialPos} = this.isGoingTo;
    let distanceX = Math.trunc(this.x - x);
    let distanceY = Math.trunc(this.y - y);
    
    if (Math.abs(distanceX) <= offset && Math.abs(distanceY) <= offset) {
      this.isWalking = false
      this.setVelocity(0, 0)
      this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
      if (!initialPos) {
        this.emit(PLAYER_CHAR_REACHED_BOX, this.activeBox);
      }
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

  createAnimations() {
    this.scene.anims.create({
			key: 'down-idle',
			frames: [{ key: 'sokoban', frame: 52 }]
		})

		this.scene.anims.create({
			key: 'down-walk',
			frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 52, end: 54 }),
			frameRate: 10,
			repeat: -1
		})

		this.scene.anims.create({
			key: 'up-idle',
			frames: [{ key: 'sokoban', frame: 55 }]
		})

		this.scene.anims.create({
			key: 'up-walk',
			frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 55, end: 57 }),
			frameRate: 10,
			repeat: -1
		})

		this.scene.anims.create({
			key: 'left-idle',
			frames: [{ key: 'sokoban', frame: 81 }]
		})

		this.scene.anims.create({
			key: 'left-walk',
			frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 81, end: 83 }),
			frameRate: 10,
			repeat: -1
		})

		this.scene.anims.create({
			key: 'right-idle',
			frames: [{ key: 'sokoban', frame: 78 }]
		})

		this.scene.anims.create({
			key: 'right-walk',
			frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 78, end: 80 }),
			frameRate: 10,
			repeat: -1
		})
  }
}
