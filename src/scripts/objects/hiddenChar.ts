import { HIDDEN_CHAR_REACHED_TARGET } from "../events/events";
import { ANIMAL_SKINS, SPRITE_NAME } from "../utils/constants";

export default class HiddenChar extends Phaser.Physics.Arcade.Sprite {
  isWalking = false;
  isGoingTo: {
    x: number,
    y: number
  }
  reachedTarget = false
  target: TargetInterface
  gotToTheBoxCallback: () => void;
  
  constructor(scene: Phaser.Scene, x: number, y: number, public skin: ANIMAL_SKINS | null) {
    super(scene, x, y, SPRITE_NAME.ROUND_ANIMALS, skin?.toString())
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(0.5)
    scene.events.on('update', this.update, this);
  }

  goTo(target: TargetInterface) {
    this.target = target
    this.isWalking = true;
    this.isGoingTo = {
      x: target.x, 
      y: target.y
    }
    target.setHiddenCharName(this.skin)
  }

  update() {
    const speed = 300
    
    if (!this.isWalking || !this.active) return
    
    const offset = 10;

    let {x, y} = this.isGoingTo;
    let distanceX = Math.trunc(this.x - x);
    let distanceY = Math.trunc(this.y - y);
    
    if (Math.abs(distanceX) <= offset && Math.abs(distanceY) <= offset) {
      this.isWalking = false
      this.setVelocity(0, 0)
      this.setAngle(0);
      this.scene.tweens.add({
        targets: this,
        y: '+=50',
        alpha: 1,
        scale: 0,
        duration: 500,
        onComplete: () => {
          this.visible = false;
        }
      })

      this.reachedTarget = true
      this.emit(HIDDEN_CHAR_REACHED_TARGET)
      return
    }
    this.angle += 1;
    if (this.body.blocked.up || this.body.blocked.down) {
      if (distanceX < 0) {
        this.setVelocity(speed, 0)
      } else if (distanceX > 0) {
        this.setVelocity(-speed, 0)
      }
      return
    }

    if (Math.abs(distanceY) > 5) {
      if (distanceY > 0) {
        this.setVelocity(0, -speed)
      } else if (distanceY < 0) {
        this.setVelocity(0, speed)
      }
      return
    }

    if (this.body.blocked.right || this.body.blocked.left) {
      if (distanceY > 0) {
        this.setVelocity(0, -speed)
      } else if (distanceY < 0) {
        this.setVelocity(0, speed)
      }
      return
    }

    if (Math.abs(distanceX) > 0) {
      if (distanceX < 0) {
        this.setVelocity(speed, 0)
      } else if (distanceX > 0) {
        this.setVelocity(-speed, 0)
      }
      return
    }
  }
}
