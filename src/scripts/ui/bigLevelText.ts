import { getOrAddAudio, playSound } from '../utils/audioUtil'
import { SOUNDS } from '../utils/constants'
import ColoredText from './coloredText'

export default class BigLevelText extends ColoredText {
  private previousValue: string
  private nextLevelAudio: Phaser.Sound.BaseSound

  constructor(scene: Phaser.Scene, x: number, y: number, content: string, style: any) {
    super(scene, x, y, content, style, false)
    this.previousValue = content
    this.nextLevelAudio = getOrAddAudio(scene, SOUNDS.NEXT_LEVEL)
    this.setOrigin(0.5)
    this.setDepth(1000)
  }

  public async updateContent(newValue: string) {
    return new Promise((resolve, reject) => {
      this.content = newValue
      if (this.previousValue !== this.content) {
        playSound(this.scene, this.nextLevelAudio)
        this.visible = true
        this.scene.tweens.add({
          targets: this.bbCodeText,
          alpha: 1,
          duration: 1000,
          scale: 1.5,
          yoyo: true,
          onComplete: () => {
            this.previousValue = this.content
            this.visible = false
            resolve()
          },
        })
      } else {
          resolve()
      }
    })
  }
}
