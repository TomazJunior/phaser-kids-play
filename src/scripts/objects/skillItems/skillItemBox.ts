import { PLAYER_TOUCHED_TARGET } from '../../events/events'
import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import Target from '../target'
import SkillItem from './skillItem'

export default class SkillItemBox extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.BOX
  private target: Target
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemBox.skin)
    scene.events.on(PLAYER_TOUCHED_TARGET, async (target: Target) => {
      if (this.selected && target && this.enabled) {
        this.target = target
        return await this.process()
      }
      return Promise.resolve()
    })
  }
  protected doAction = async (): Promise<void> => {
    this.target.stuckTarget()
    return Promise.resolve()
  }
}
