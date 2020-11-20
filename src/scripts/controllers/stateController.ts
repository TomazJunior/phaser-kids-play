import SkillItem from '../objects/skillItems/skillItem'
import { MAIN_SCENE_STATE } from '../utils/constants'

export class StateController {
  private _state: MAIN_SCENE_STATE
  private _skillItemsInScene: Array<SkillItemInScene>
  private static instance: StateController
  private constructor() {}
  public static getInstance(): StateController {
    if (!StateController.instance) {
      StateController.instance = new StateController()
    }

    return StateController.instance
  }

  public set skillItemsInScene(skillItems: Array<SkillItemInScene>) {
    this._skillItemsInScene = skillItems
  }

  public get skillItemsInScene(): Array<SkillItemInScene> {
    return this._skillItemsInScene
  }

  public changeState(state: MAIN_SCENE_STATE) {
    this._state = state
    this.skillItemsInScene?.forEach((skillItemInScene) => {
      const { skillItem } = skillItemInScene
      skillItem.enabled = skillItem.skillItemDefinition.state === state
    })
    if (state === MAIN_SCENE_STATE.GAME_OVER) {
      this.skillItemsInScene = []
    }
  }

  public get currentState(): MAIN_SCENE_STATE {
    return this._state
  }

  public get selectedSkillItem(): SkillItem | undefined {
    const skillItemInScene = this.skillItemsInScene.find((s) => {
      return s.skillItem.selected
    })
    return skillItemInScene?.skillItem
  }

  public getSkillItemsOfCurrentState = (): Array<SkillItem> => {
    return this.skillItemsInScene
      ?.filter((s) => s.quantity && s.skillItem.skillItemDefinition.state === this.currentState)
      .map((s) => s.skillItem)
  }

  public decreaseSkillItem = (skillItem: SkillItem): number => {
    const skinItemInScene = this.skillItemsInScene?.find(
      (s) => s.skillItem.skillItemDefinition.skin === skillItem.skillItemDefinition.skin
    )
    if (skinItemInScene) {
      skinItemInScene.quantity--
    }

    return skinItemInScene?.quantity || 0
  }
}
