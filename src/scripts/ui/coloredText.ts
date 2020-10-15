import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'

export default class ColoredText {
  private _content: string
  protected bbCodeText: BBCodeText
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, content: string, style: any, visible = true) {
    this.scene = scene
    this._content = content
    this.bbCodeText = new BBCodeText(scene, x, y, content, style)
    this.bbCodeText.visible = visible
    scene.add.existing(this.bbCodeText)
    this.updateColoredText()
  }

  public set content(v: string) {
    this._content = v
    this.updateColoredText()
  }

  public get content() {
    return this._content
  }

  public setOrigin(x?: number, y?: number) {
    this.bbCodeText.setOrigin(x, y)
    return this
  }

  public setDepth(depth: number) {
    this.bbCodeText.setDepth(depth)
    return this
  }

  public get visible(): boolean {
    return this.bbCodeText.visible
  }

  public set visible(v: boolean) {
    this.bbCodeText.visible = v    
  }

  private updateColoredText() {
    const colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple']
    let index = 0
    const content = this._content.split('').reduce((finalText: string, char: string) => {
      if (char === ' ') return `${finalText} `
      const color = colors.length === index ? colors[0] : colors[index++]
      return `${finalText}[color=${color}]${char}[/color]`
    }, '')
    this.bbCodeText.setText(content)
  }
}
