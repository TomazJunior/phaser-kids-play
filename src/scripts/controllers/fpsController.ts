export class FPSController {
  private static CURRENT_FPS = 30
  private static EXPECTED_FRAME_TIME: number = 1000 / FPSController.CURRENT_FPS
  private static instance: FPSController
  private frameTimeMap: Map<string, number> = new Map()
  private gameTick: number = 0

  private constructor() {}
  public static getInstance(): FPSController {
    if (!FPSController.instance) {
      FPSController.instance = new FPSController()
    }

    return FPSController.instance
  }

  public shouldUpdate(key: string, delta: number): boolean {
    let frameTime = 0
    if (!this.frameTimeMap.has(key)) {
      frameTime = delta
      this.frameTimeMap.set(key, delta)
    } else {
      frameTime = this.frameTimeMap.get(key)! + delta
      this.frameTimeMap.set(key, frameTime)
    }

    // console.log(`frameTime: ${key} - ${frameTime} - ${this.gameTick}`)
    if (frameTime > FPSController.EXPECTED_FRAME_TIME) {
      this.frameTimeMap.set(key, 0)
      this.gameTick++
      return true
    }
    return false
  }
}
