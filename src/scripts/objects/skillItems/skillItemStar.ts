import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import SkillItem from './skillItem'

export default class SkillItemStar extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.STAR
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemStar.skin)
  }
  doAction = async (): Promise<void> => {
    return Promise.resolve()
  }
}
