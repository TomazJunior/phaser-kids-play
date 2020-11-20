import { SKILL_ITEM_SKINS } from '../../utils/skillItems'
import Firework from '../fireworks'
import SkillItem from './skillItem'

export default class SkillItemStar extends SkillItem {
  public static readonly skin = SKILL_ITEM_SKINS.STAR
  firework: Firework
  constructor(scene: Phaser.Scene) {
    super(scene, SkillItemStar.skin)
    const {width, height} = this.scene.scale
    this.firework = new Firework(scene, width * 0.4, height * 0.5)
  }
  protected doAction = async (): Promise<void> => {
    return new Promise((resolve) => {
      this.firework.show()
      this.scene.time.delayedCall(1000, () => {
        resolve()
      })
    })
    
  }
}
