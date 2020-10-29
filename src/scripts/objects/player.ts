import { PLAYER_CHAR_REACHED_TARGET, PLAYER_REACHED_FINAL_POS, PLAYER_REACHED_INITIAL_POS } from '../events/events'
import { PLAYER, SOUNDS, TILES } from '../utils/constants'
import { getOrAddAudio, playSound } from '../utils/audioUtil'

export default abstract class Player extends Phaser.Physics.Arcade.Sprite implements PlayerInterface {
  isWalking = false
  isGoingTo: {
    x: number
    y: number
    initialPos: false
  }
  activeTarget: TargetInterface
  animation: string
  walkingAudio: Phaser.Sound.BaseSound
  objectPosition: ObjectPosition
  pathToGo: Array<ObjectPosition>
  targetObjectPosition: ObjectPosition | undefined

  constructor(
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, objectPosition.x, objectPosition.y, texture, frame)
    scene.add.existing(this)
    this.objectPosition = objectPosition
    scene.physics.add.existing(this)
    this.setDepth(10)
    this.setCollideWorldBounds(true)
    this.active = false
    this.createAnimations()
    this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
    this.play(this.animation, true)
    this.pathToGo = []

    // player will be visible only after all chars being hidden
    this.setVisible(false)

    this.walkingAudio = getOrAddAudio(scene, SOUNDS.WALKING, { volume: 0.4, loop: true })
    scene.events.on('update', this.update, this)
  }

  protected abstract createAnimations()

  public setIsGoingTo(pathToGo: Array<ObjectPosition>, initialPos) {
    playSound(this.scene, this.walkingAudio)
    this.isWalking = true
    this.pathToGo = pathToGo
    this.goToNextPosition(initialPos)
  }

  public goTo(target: TargetInterface, pathToGo: Array<ObjectPosition>) {
    if (this.walkingAudio.isPlaying) this.walkingAudio.stop()
    if (!this.active) return

    this.setIsGoingTo(pathToGo, false)
    this.setActiveBox(target)
  }

  public goToPath(targetObjectPosition: ObjectPosition, pathToGo: Array<ObjectPosition>) {
    if (this.walkingAudio.isPlaying) this.walkingAudio.stop()
    if (!this.active) return
    this.targetObjectPosition = targetObjectPosition

    this.setIsGoingTo(pathToGo, true)
  }

  private setActiveBox(box: TargetInterface) {
    if (this.activeTarget) {
      this.activeTarget.close()
    }
    this.activeTarget = box
    this.activeTarget.isSelected()
    this.targetObjectPosition = undefined
  }

  update() {
    if (!this.active) {
      if (this.walkingAudio.isPlaying) this.walkingAudio.stop()
      return
    }
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
          this.emit(PLAYER_CHAR_REACHED_TARGET, this.activeTarget)
        } else if (this.targetObjectPosition) {
          switch (this.targetObjectPosition.tile) {
            case TILES.INIT_POSITION:
              this.emit(PLAYER_REACHED_INITIAL_POS)
              break
            case TILES.FINAL_POSITION:
              this.emit(PLAYER_REACHED_FINAL_POS)
              break
          }
          this.targetObjectPosition = undefined
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
