import Box from './box'
import { PLAYER_CHAR_REACHED_BOX } from '../events/events'
import { PLAYER } from '../utils/constants'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  isWalking = false
  isGoingTo: {
    x: number
    y: number
    initialPos: false
  }
  activeBox: Box
  animation: string
  walkingAudio: Phaser.Sound.BaseSound
  objectPosition: ObjectPosition
  pathToGo: Array<ObjectPosition>

  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition) {
    super(scene, objectPosition.x, objectPosition.y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(1.5).setOffset(16, 16)

    this.objectPosition = objectPosition
    this.setCollideWorldBounds(true)
    this.active = false
    this.createAnimations()
    this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
    this.play(this.animation, true)
    this.pathToGo = []

    this.walkingAudio = scene.sound.get('walking') || scene.sound.add('walking', { volume: 0.4, loop: true })
    scene.events.on('update', this.update, this)
  }

  goTo(box: Box, pathToGo: Array<ObjectPosition>) {
    if (!this.active) return

    if (this.walkingAudio.isPlaying) this.walkingAudio.stop()

    this.setActiveBox(box)
    this.setIsGoingTo(pathToGo, false)
  }

  setIsGoingTo(pathToGo: Array<ObjectPosition>, initialPos) {
    this.walkingAudio.play()
    this.isWalking = true
    this.pathToGo = pathToGo
    this.goToNextPosition(initialPos)
  }

  setActiveBox(box: Box) {
    if (this.activeBox) {
      this.activeBox.close()
    }
    this.activeBox = box
    this.activeBox.isSelected()
  }

  update() {
    // return
    if (!this.active) return
    this.play(this.animation, true)

    const speed = 350
    // offset to garantee player won't collide up/down with the boxes
    const offset = 10

    if (!this.isWalking) return

    let { x, y, initialPos } = this.isGoingTo
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
        this.goToNextPosition(initialPos)
      } else {
        this.isWalking = false
        this.setVelocity(0, 0)
        this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
        if (!initialPos) {
          this.emit(PLAYER_CHAR_REACHED_BOX, this.activeBox)
        }
        this.walkingAudio.stop()
      }
      return
    }

    const leftDown = distanceX < 0
    const rightDown = distanceX > 0
    const upDown = distanceY < 0
    const downDown = distanceY > 0

    if (leftDown) {
      this.animation = PLAYER.ANIMATIONS.LEFT_WALK
      this.setVelocity(-speed, 0)
    } else if (rightDown) {
      this.animation = PLAYER.ANIMATIONS.RIGHT_WALK
      this.setVelocity(speed, 0)
    } else if (upDown) {
      this.animation = PLAYER.ANIMATIONS.UP_WALK
      this.setVelocity(0, -speed)
    } else if (downDown) {
      this.animation = PLAYER.ANIMATIONS.DOWN_WALK
      this.setVelocity(0, speed)
    } else {
      this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
      this.setVelocity(0, 0)
    }

  }

  createAnimations() {
    this.scene.anims.create({
      key: 'down-idle',
      frames: [{ key: 'sokoban', frame: 52 }],
    })

    this.scene.anims.create({
      key: 'down-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 52, end: 54 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'up-idle',
      frames: [{ key: 'sokoban', frame: 55 }],
    })

    this.scene.anims.create({
      key: 'up-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 55, end: 57 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'left-idle',
      frames: [{ key: 'sokoban', frame: 81 }],
    })

    this.scene.anims.create({
      key: 'left-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 81, end: 83 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'right-idle',
      frames: [{ key: 'sokoban', frame: 78 }],
    })

    this.scene.anims.create({
      key: 'right-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 78, end: 80 }),
      frameRate: 10,
      repeat: -1,
    })
  }

  private goToNextPosition = (initialPos) => {
    const moviment = this.pathToGo.shift()
    
    if (moviment) {
      this.objectPosition = moviment
      this.isGoingTo = {
        x: moviment.x,
        y: moviment.y,
        initialPos,
      }
    }
  }
}
