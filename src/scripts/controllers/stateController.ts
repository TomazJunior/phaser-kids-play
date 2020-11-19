import SkillItem from '../objects/skillItems/skillItem'
import { MAIN_SCENE_STATE } from '../utils/constants'

export class StateController {
  private _state: MAIN_SCENE_STATE
  private _skillItems: Array<SkillItem>
  private static instance: StateController
  private constructor() {}
  public static getInstance(): StateController {
    if (!StateController.instance) {
      StateController.instance = new StateController()
    }

    return StateController.instance
  }

  public set skillItems(skillItems: Array<SkillItem>) {
    this._skillItems = skillItems
  }

  public get skillItems(): Array<SkillItem> {
    return this._skillItems
  }

  public changeState(state: MAIN_SCENE_STATE) {
    this._state = state
    this.skillItems?.forEach((s) => {
      s.enabled = s.skillItemDefinition.state === state
    })
    if (state === MAIN_SCENE_STATE.GAME_OVER) {
      this.skillItems = []
    }
  }

  public get currentState(): MAIN_SCENE_STATE {
    return this._state
  }

  public get selectedSkillItem(): SkillItem | undefined {
    return this.skillItems?.find((s) => s.selected)
  }

  public getSkillItemsOfCurrentState = (): Array<SkillItem> => {
    return this.skillItems?.filter((s) => s.skillItemDefinition.state === this.currentState)
  }
}
