import { BBCodeText } from 'phaser3-rex-plugins/templates/ui/ui-components.js'

export default class ColoredText{
    private bbCodeText: BBCodeText
    private _content: string
    
    constructor(scene: Phaser.Scene, x: number, y: number, content: string, style: any) {
        this._content = content
        this.bbCodeText = new BBCodeText(scene, x, y, content, style) 
        scene.add.existing(this.bbCodeText)
        this.updateColoredText()
    }

    public set content(v : string) {
        this._content = v;
        this.updateColoredText()
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