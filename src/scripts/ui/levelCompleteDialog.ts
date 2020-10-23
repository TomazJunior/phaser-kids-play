import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { FONTS, SOUNDS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class LevelCompleteDialog extends Phaser.GameObjects.Sprite {
  private nextLevelAudio: Phaser.Sound.BaseSound

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    score: string,
    shouldPlaySound: boolean,
    firstButton: ButtonConfig,
    secondButton: ButtonConfig,
    thirdButton: ButtonConfig
  ) {
    super(scene, x, y, 'level-complete-dialog')
    scene.add.existing(this)
    this.nextLevelAudio = getOrAddAudio(scene, SOUNDS.NEXT_LEVEL)

    const textTitle = this.scene.add
      .text(this.x, this.y - this.displayHeight * 0.5 + 20, 'Level Complete', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '40px',
      })
      .setOrigin(0.5, 0)

    const middleTitleShadow = this.scene.add
      .text(this.x - this.displayWidth * 0.5 + 10, this.y + 10, title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '53px',
      })
      .setTint(0xffc383)
      .setAlpha(0.6)
      .setOrigin(0, 0)

    const middleTitle = this.scene.add
      .text(this.x - this.displayWidth * 0.5 + 10, this.y + 10, title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '52px',
      })
      .setOrigin(0, 0)

    const textScore = this.scene.add
      .text(this.x + this.displayWidth * 0.3 - 30, this.y + 10, score, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '48px',
      })
      .setOrigin(0.5, 0)

    new ButtonSmall(
      scene,
      this.x - this.displayWidth * 0.4 + 40,
      this.y + this.displayHeight * 0.3,
      firstButton
    ).setOrigin(0, 0)

    new ButtonSmall(scene, this.x - 50, this.y + this.displayHeight * 0.3, secondButton).setOrigin(0, 0)

    new ButtonSmall(scene, this.x + this.displayWidth * 0.2, this.y + this.displayHeight * 0.3, thirdButton).setOrigin(
      0,
      0
    )

    shouldPlaySound && playSound(this.scene, this.nextLevelAudio)
  }
}
