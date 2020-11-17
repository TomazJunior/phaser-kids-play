import { MAIN_SCENE_STATE } from '../utils/constants'

export class StateController {
  private _state: MAIN_SCENE_STATE
  private static instance: StateController
  private constructor() {}
  public static getInstance(): StateController {
    if (!StateController.instance) {
      StateController.instance = new StateController()
    }

    return StateController.instance
  }

  public changeState(state: MAIN_SCENE_STATE) {
    console.log(`state: ${state}`)
    this._state = state
  }

  public get currentState(): MAIN_SCENE_STATE {
    return this._state
  }
}
