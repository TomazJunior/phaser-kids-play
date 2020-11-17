import { SKILL_ITEM_SKINS } from '../utils/skillItems'
import skillItems from './skillItems'

export class SkillItemList {
  public static get skills(): Array<SkillItemListInterface> {
    return skillItems.map((skillItem) => {
      return { clazz: skillItem, skin: skillItem.skin }
    })
  }

  public static getSkillItemBySkill(skin: SKILL_ITEM_SKINS): SkillItemListInterface | undefined {
    return SkillItemList.skills.find(s => s.skin === skin)
  }
}
