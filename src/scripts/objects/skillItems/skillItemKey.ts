import { PLAYER_TOUCHED_TARGET } from '../../events/events'
import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import Target from '../target'
import SkillItem from './skillItem'

export default class SkillItemKey extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.KEY
  private target: Target
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemKey.skin)
    scene.events.on(PLAYER_TOUCHED_TARGET, async (target: Target) => {
      if (this.selected && target && this.enabled) {
        this.target = target
        return await this.process()
      }
      return Promise.resolve()
    })
  }
  protected doAction = async (): Promise<void> => {
    this.target.openTarget(false)
    if (this.target.hiddenChar) {
      return await this.target.hiddenChar.getOutNearToTarget(() => {
        return Promise.resolve()
      })
    }
    return Promise.resolve()
  }
}
