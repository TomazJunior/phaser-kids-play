import {
  HIDDEN_CHAR_REACHED_FINAL_POS,
  HIDDEN_CHAR_REACHED_ROAD_POS,
  HIDDEN_CHAR_REACHED_TARGET,
} from '../events/events'
import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { ANIMAL_SKINS, SOUNDS, SPRITE_NAME, TILES } from '../utils/constants'
import { GameMap } from '../controllers/gameMap'

export default class HiddenChar extends Phaser.Physics.Arcade.Sprite {
  isWalking = false
  isGoingTo: {
    x: number
    y: number
    row: number
    col: number
    roadPosition: boolean
  }
  reachedTarget = false
  target: TargetInterface
  objectPosition: ObjectPosition
  pathToGo: Array<ObjectPosition>
  targetObjectPosition: ObjectPosition | undefined
  gameMap: GameMap
  speed: number
  enterOnTargetAudio: Phaser.Sound.BaseSound
  enterOnDoorAudio: Phaser.Sound.BaseSound

  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition, gameMap: GameMap, public skin: ANIMAL_SKINS | null) {
    super(scene, objectPosition.x, objectPosition.y, SPRITE_NAME.ROUND_ANIMALS, skin?.toString())
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.objectPosition = objectPosition
    this.gameMap = gameMap
    this.setBodySize(this.width * 0.5, this.height * 0.5)
    this.setScale(0.5)
    this.setCollideWorldBounds(true)
    this.pathToGo = []
    this.speed = 300
    this.enterOnTargetAudio = getOrAddAudio(scene, SOUNDS.ENTER_THE_BOX)
    this.enterOnDoorAudio = getOrAddAudio(scene, SOUNDS.ENTER_THE_DOOR)
    scene.events.on('update', this.update, this)
  }

  public setIsGoingTo(pathToGo: Array<ObjectPosition>, roadPosition: boolean) {
    this.isWalking = true
    this.pathToGo = [...pathToGo]
    this.goToNextPosition(roadPosition)
  }

  public goTo(target: TargetInterface, pathToGo: Array<ObjectPosition>) {
    this.target = target
    this.targetObjectPosition = undefined
    target.setHiddenCharName(this.skin)
    this.setIsGoingTo(pathToGo, false)
  }

  public goToPath(targetObjectPosition: ObjectPosition, pathToGo: Array<ObjectPosition>) {
    this.targetObjectPosition = targetObjectPosition
    this.setIsGoingTo(pathToGo, true)
  }

  public goToDoor(targetObjectPosition: ObjectPosition) {
    this.scene.tweens.add({
      targets: this,
      x: targetObjectPosition.x,
      y: targetObjectPosition.y,
      scale: 0.4,
      duration: 500,
      onStart: () => {
        playSound(this.scene, this.enterOnDoorAudio)
      },
      onComplete: async () => {
        this.visible = false
        this.emit(HIDDEN_CHAR_REACHED_FINAL_POS, this)
      },
    })
  }

  public getOut(position: ObjectPosition, onComplete: () => Promise<void>) {
    this.speed = 350
    this.isWalking = false
    this.visible = true
    this.reachedTarget = false
    const pathToGo = this.gameMap.getPathTo(this.objectPosition, this.target.objectPosition)
    const lastPosition = pathToGo.pop()
    if (!lastPosition) throw new Error('lastPosition can not be null')

    this.scene.tweens.add({
      targets: this,
      x: lastPosition.x,
      y: lastPosition.y,
      scale: 0.5,
      duration: 500,
      onComplete: async () => {
        const pathToGo = this.gameMap.getPathTo(lastPosition, position, false)
        this.goToPath(position, pathToGo)
        this.once(HIDDEN_CHAR_REACHED_ROAD_POS, async () => {
          this.removeListener(HIDDEN_CHAR_REACHED_ROAD_POS)
          await onComplete()
        })
      },
    })
  }

  update() {
    if (!this.isWalking || !this.active) return

    const offset = 10

    let { x, y, roadPosition } = this.isGoingTo
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
        this.goToNextPosition(roadPosition)
      } else {
        this.isWalking = false
        this.setVelocity(0, 0)
        this.setAngle(0)
        this.objectPosition = this.isGoingTo

        if (!roadPosition) {
          this.scene.tweens.add({
            targets: this,
            y: this.target.y - 100,
            x: this.target.x,
            scale: 0.4,
            duration: 500,
            onComplete: () => {
              this.scene.tweens.add({
                targets: this,
                y: this.target.y,
                ease: 'Quart.easeIn',
                duration: 500,
                onStart: () => {
                  playSound(this.scene, this.enterOnTargetAudio)
                },
                onComplete: () => {
                  this.reachedTarget = true
                  this.emit(HIDDEN_CHAR_REACHED_TARGET)
                  this.visible = false
                },
              })
            },
          })
        } else if (this.targetObjectPosition) {
          switch (this.targetObjectPosition.tile) {
            case TILES.FINAL_POSITION:
              this.reachedTarget = true  
              this.emit(HIDDEN_CHAR_REACHED_FINAL_POS, this)
              break
            default:
              this.emit(HIDDEN_CHAR_REACHED_ROAD_POS)
              break
          }
          this.targetObjectPosition = undefined
        }
      }
      return
    }

    const leftDown = distanceX < 0
    const rightDown = distanceX > 0
    const upDown = distanceY < 0
    const downDown = distanceY > 0

    this.angle += 1
    if (leftDown) {
      this.setVelocity(-this.speed, 0)
    } else if (rightDown) {
      this.setVelocity(this.speed, 0)
    } else if (upDown) {
      this.setVelocity(0, -this.speed)
    } else if (downDown) {
      this.setVelocity(0, this.speed)
    } else {
      this.setVelocity(0, 0)
    }
  }

  private goToNextPosition = (roadPosition: boolean) => {
    const moviment = this.pathToGo.shift()
    if (moviment) {
      this.objectPosition = { ...this.isGoingTo }
      this.isGoingTo = {
        ...moviment,
        roadPosition,
      }
    } else {
      this.isGoingTo = {
        ...this.isGoingTo,
        roadPosition,
      }
    }
  }
}
