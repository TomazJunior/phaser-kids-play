import { MAX_TIMER_DURATION } from '../utils/constants'

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

  update() {
    if (!this.timerEvent) {
      return
    }

    const elapsed = this.timerEvent.getElapsed()
    this._seconds = elapsed / 1000
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
