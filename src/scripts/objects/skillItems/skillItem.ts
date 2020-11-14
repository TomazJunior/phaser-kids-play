import { getSkillItemDefinition, SKILL_ITEM_SKINS } from '../../utils/skillItems'


export default abstract class SkillItem {
  skillItemDefinition: SkillItemDefinition
  constructor(private scene: Phaser.Scene, skin: SKILL_ITEM_SKINS) {
    this.skillItemDefinition = getSkillItemDefinition(skin)
  }
  public static readonly skin: SKILL_ITEM_SKINS
  doAction: () => Promise<void>
}
