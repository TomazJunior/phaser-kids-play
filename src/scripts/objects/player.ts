import { PLAYER_CHAR_REACHED_TARGET, PLAYER_REACHED_FINAL_POS, PLAYER_REACHED_INITIAL_POS } from '../events/events'
import { OBJECT_DEPTHS, PLAYER, SOUNDS, TILES } from '../utils/constants'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import HiddenChar from './hiddenChar'
import { GameMap } from '../controllers/gameMap'

export default abstract class Player extends Phaser.Physics.Arcade.Sprite implements PlayerInterface {
  private _isReady: boolean = false
  isWalking = false
  isGoingTo: {
    x: number
    y: number
    row: number
    col: number
    roadPosition: boolean
  }
  activeTarget: TargetInterface
  animation: string
  walkingAudio: Phaser.Sound.BaseSound
  objectPosition: ObjectPosition
  pathToGo: Array<ObjectPosition>
  targetObjectPosition: ObjectPosition | undefined
  foundChars: Array<HiddenChar>
  gameMap: GameMap
  isInTheFarRightSide: boolean

  constructor(
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    gameMap: GameMap,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, objectPosition.x, objectPosition.y, texture, frame)
    scene.add.existing(this)
    this.gameMap = gameMap
    this.objectPosition = objectPosition
    scene.physics.add.existing(this)
    this.setDepth(OBJECT_DEPTHS.PLAYER)
    this.setCollideWorldBounds(true)
    this.active = false
    this.createAnimations()
    this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
    this.play(this.animation, true)
    this.pathToGo = []

    // player will be visible only after all chars being hidden
    this.setVisible(false)

    this.isInTheFarRightSide = false

    this.foundChars = []
    this.walkingAudio = getOrAddAudio(scene, SOUNDS.WALKING, { volume: 0.4, loop: true })
    scene.events.on('update', this.update, this)
  }

  protected abstract createAnimations()

  public get isReady(): boolean {
    return this._isReady && this.active
  }

  public setIsGoingTo(pathToGo: Array<ObjectPosition>, roadPosition: boolean) {
    playSound(this.scene, this.walkingAudio)
    this.isWalking = true
    this.pathToGo = pathToGo
    this.goToNextPosition(roadPosition)
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

  public pushHiddenChar = (
    hiddenChar: HiddenChar,
    target: TargetInterface | undefined,
    onComplete: () => Promise<void>
  ) => {
    const objectPosition = this.foundChars.length
      ? this.foundChars[this.foundChars.length - 1].objectPosition
      : this.objectPosition

    let neighbor: ObjectPosition | undefined
    const neighbors = this.gameMap.findNeighbors(objectPosition)

    if (target?.objectPosition) {
      neighbor = this.getTheBestHiddenPosition(target.objectPosition, neighbors)
    } else {
      const playerFinalPosition = this.gameMap.getPlayerFinalPosition()
      neighbor = this.getTheBestHiddenPosition(playerFinalPosition, neighbors)
    }

    // if dont find neighbor in the right position
    if (!neighbor) {
      const neighborKey = Object.keys(neighbors).find((key) => {
        return neighbors[key].x || neighbors[key].y
      })

      if (neighborKey) {
        neighbor = this.gameMap.getTilePosition(neighbors[neighborKey].y, neighbors[neighborKey].x)
      }
    }

    if (!neighbor) throw new Error('No available position next player')

    this.foundChars.push(hiddenChar)
    hiddenChar.getOut(neighbor, onComplete)
  }

  private getTheBestHiddenPosition(objectPosition: ObjectPosition, neighbors: Neighbors): ObjectPosition | undefined {
    let neighbor

    let distanceX = Math.trunc(objectPosition.x - this.x)
    let distanceY = Math.trunc(objectPosition.y - this.y)

    if (Math.abs(distanceX) < 5) {
      distanceX = 0
    }
    if (Math.abs(distanceY) < 5) {
      distanceY = 0
    }

    const rightDown = distanceX < 0
    const leftDown = distanceX > 0
    const downDown = distanceY < 0
    const upDown = distanceY > 0

    if (!neighbor && leftDown && neighbors.left) {
      neighbor = this.gameMap.getTilePosition(neighbors.left.y, neighbors.left.x)
    }

    if (!neighbor && rightDown && neighbors.right) {
      neighbor = this.gameMap.getTilePosition(neighbors.right.y, neighbors.right.x)
    }

    if (!neighbor && upDown && neighbors.top) {
      neighbor = this.gameMap.getTilePosition(neighbors.top.y, neighbors.top.x)
    }

    if (!neighbor && downDown && neighbors.bottom) {
      neighbor = this.gameMap.getTilePosition(neighbors.bottom.y, neighbors.bottom.x)
    }
    return neighbor
  }

  private moveHiddenChars(objectPosition: ObjectPosition, finalPosition: boolean = false) {
    if (!this.foundChars.length) return
    for (let index = 0; index < this.foundChars.length; index++) {
      const hiddenChar: HiddenChar = this.foundChars[index]
      let previousPosition: ObjectPosition
      if (index === 0 || finalPosition) {
        previousPosition = objectPosition
      } else {
        previousPosition = this.foundChars[index - 1].objectPosition
      }
      const pathToGo = this.gameMap.getPathTo(hiddenChar.objectPosition, previousPosition)
      hiddenChar.goToPath(previousPosition, pathToGo)
    }
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
    // offset to garantee player won't collide up/down with the boxes
    const offsetRightSide = 15

    if (!this.isWalking) return

    let { x, y, roadPosition: initialPos } = this.isGoingTo
    let distanceX = Math.trunc(x - this.x)
    let distanceY = Math.trunc(y - this.y)

    if (Math.abs(distanceX) < offset) {
      distanceX = 0
    }
    if (Math.abs(distanceY) < offset) {
      distanceY = 0
    }

    const reachedTheRightSide =
      Math.abs(Math.trunc(this.scene.scale.width - this.x)) < offsetRightSide &&
      this.animation !== PLAYER.ANIMATIONS.DOWN_IDLE &&
      !this.isInTheFarRightSide
      
    if (reachedTheRightSide) {
      distanceX = 0
      this.pathToGo = []
      this.isInTheFarRightSide = true
    }

    if (distanceX === 0 && distanceY === 0) {
      if (this.pathToGo.length) {
        this.goToNextPosition(initialPos)
        this.isInTheFarRightSide = false
      } else {
        this.isWalking = false
        this.setVelocity(0, 0)
        this.objectPosition = this.isGoingTo

        this.animation = PLAYER.ANIMATIONS.DOWN_IDLE
        if (!initialPos) {
          this.emit(PLAYER_CHAR_REACHED_TARGET, this.activeTarget)
        } else if (this.targetObjectPosition) {
          switch (this.targetObjectPosition.tile) {
            case TILES.INIT_POSITION:
              this._isReady = true
              this.emit(PLAYER_REACHED_INITIAL_POS)
              break
            case TILES.FINAL_POSITION:
              this.moveHiddenChars(this.objectPosition, true)
              this.emit(PLAYER_REACHED_FINAL_POS)
              break
          }
          this.targetObjectPosition = undefined
          this.foundChars = []
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

    this.moveHiddenChars(this.objectPosition, false)
  }

  private goToNextPosition = (roadPosition: boolean) => {
    const moviment = this.pathToGo.shift()

    if (moviment) {
      this.objectPosition = { ...this.isGoingTo }
      this.isGoingTo = {
        ...moviment,
        roadPosition,
      }
    }
  }
}
