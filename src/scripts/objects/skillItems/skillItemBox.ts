import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import SkillItem from './skillItem'

export default class SkillItemBox extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.BOX
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemBox.skin)
  }
  doAction = async (): Promise<void> => {
    return Promise.resolve()
  }
}
