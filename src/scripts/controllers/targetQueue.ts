import { HIDDEN_CHARS_ENQUEUED, PLAYER_TOUCHED_TARGET } from '../events/events'

export class TargetQueue {
  private queue: Array<number> = []
  private queueLocked = true

  constructor(private scene: Phaser.Scene, private level: Level, private targets: Array<TargetInterface>) {
    targets.forEach((target) => target.on(PLAYER_TOUCHED_TARGET, this.handleTargetQueue))
  }

  enqueue(target: TargetInterface) {
    if (this.queueLocked) return
    this.queue = [...this.queue, target.id]
    target.showQueuePosition(this.queue.length)
    
    if (this.level.hiddens === this.queue.length) {
      this.scene.events.emit(HIDDEN_CHARS_ENQUEUED)
      this.queueLocked = true
    }
  }

  dequeue(): TargetInterface | undefined {
    if (!this.queue.length) return undefined
    const id = this.queue.shift()
    if (id === undefined) return undefined
    return this.getTarget(id)
  }

  removeFromQueue(target: TargetInterface) {
    if (this.queueLocked) return
    this.queue = this.queue.filter((id) => id !== target.id)

    target.hideQueuePosition()
    this.queue.forEach((id, index) => {
      const foundTarget = this.getTarget(id)
      foundTarget?.showQueuePosition(index + 1)
    })
  }

  public clear() {
    this.queue = []
    this.queueLocked = false
  }

  public get completed(): boolean {
    return this.queueLocked
  }

  public get isEmpty(): boolean {
    return !this.queue.length
  }

  private handleTargetQueue = (target: TargetInterface) => {
    if (this.queueLocked) return
    const index = this.queue.findIndex((id) => id === target.id)
    if (index !== -1) {
      this.removeFromQueue(target)
    } else {
      this.enqueue(target)
    }
  }

  private getTarget(id: number): TargetInterface | undefined {
    return this.targets.find((target) => target.id === id)
  }
}
