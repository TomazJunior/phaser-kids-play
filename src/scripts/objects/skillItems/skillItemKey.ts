import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import SkillItem from './skillItem'

export default class SkillItemKey extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.KEY
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemKey.skin)
  }
  doAction = async (): Promise<void> => {
    return Promise.resolve()
  }
}
