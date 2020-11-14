import skillItems from './skillItems'

export class SkillItemList {
  public static get skills(): Array<SkillItemListInterface> {
    return skillItems.map((skillItem) => {
      return { clazz: skillItem, skin: skillItem.skin }
    })
  }
}
