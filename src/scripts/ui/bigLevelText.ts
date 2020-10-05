import ColoredText from './coloredText'

export default class BigLevelText extends ColoredText {
  private previousValue: string

  constructor(scene: Phaser.Scene, x: number, y: number, content: string, style: any) {
    super(scene, x, y, content, style, false)
    this.previousValue = content
    this.setOrigin(0.5)
  }

  public async updateContent(newValue: string) {
    return new Promise((resolve, reject) => {
      this.content = newValue
      if (this.previousValue !== this.content) {
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
