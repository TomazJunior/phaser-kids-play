import { MAX_TIMER_DURATION } from '../utils/constants'
import { FPSController } from './fpsController'

export class Timer {
  private timerEvent: Phaser.Time.TimerEvent | undefined
  private _seconds: number

  constructor(private scene: Phaser.Scene, private onUpdate: (seconds: number) => void) {
    scene.events.on('update', this.update, this)
  }

  start() {
    this.stop()
    this.timerEvent = this.scene.time.addEvent({
      loop: true,
    })
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy()
      this.timerEvent = undefined
    }
  }

  update(time, delta) {
    if (!this.timerEvent) {
      return
    }
    if (!FPSController.getInstance().shouldUpdate('timer', delta)) {
      return
    }
    const elapsed = this.timerEvent.getElapsed()
    this._seconds = elapsed / 1000
    this._seconds = Math.round(this._seconds * 100) / 100
    this.onUpdate(this._seconds)

    if (this._seconds >= MAX_TIMER_DURATION) {
      this.stop()
      this._seconds = MAX_TIMER_DURATION
    }
  }

  public get seconds(): number {
    return this._seconds
  }
}
