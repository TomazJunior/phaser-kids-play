import { HIDDEN_CHARS_ENQUEUED, PLAYER_TOUCHED_TARGET } from '../events/events'
import { ANIMAL_SKINS } from '../utils/constants'

export class TargetQueue {
  private queue: Array<number> = []
  private queueLocked = true

  constructor(
    private scene: Phaser.Scene,
    private level: Level,
    private targets: Array<TargetInterface>,
    private inTutorialMode: boolean,
    private currentHiddenSkins: ANIMAL_SKINS[]
  ) {
    targets.forEach((target) => target.on(PLAYER_TOUCHED_TARGET, this.handleTargetQueue))
  }

  enqueue(target: TargetInterface) {
    if (this.queueLocked) return
    this.queue = [...this.queue, target.id]
    target.showQueuePosition(this.queue.length)
    
    if (this.inTutorialMode) {
      target.toggleHelp(false)
      if (this.currentHiddenSkins.length > this.queue.length) {
        const nextTarget = this.getTargetByHiddenChar(this.currentHiddenSkins[this.queue.length])
        nextTarget && nextTarget.toggleHelp(true)
      } else {
        this.inTutorialMode = false
        this.currentHiddenSkins = []
      }
    }
    
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

  getNext(): TargetInterface | undefined {
    return !this.isEmpty ? this.getTarget(this.queue[0]) : undefined
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
    if(!this.isValidIfIsTutorialMode(target)) return

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

  private getTargetByHiddenChar(hiddenCharName: ANIMAL_SKINS): TargetInterface | undefined {
    return this.targets.find((target) => target.hiddenCharName === hiddenCharName)
  }

  private isValidIfIsTutorialMode(target: TargetInterface): boolean {
    if (!this.inTutorialMode) return true
    return target.hiddenCharName === this.currentHiddenSkins[this.queue.length]
  }
}
