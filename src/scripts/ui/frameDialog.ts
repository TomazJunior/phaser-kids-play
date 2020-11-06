import { BUTTON, BUTTON_PREFIX } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class FrameDialog extends Phaser.GameObjects.Sprite {
  private line: Array<string> = []
  private wordIndex = 0
  private lineIndex = 0
  private text: Phaser.GameObjects.Text
  private group: Phaser.GameObjects.Group
  wordDelay = 50
  lineDelay = 100
  closeButton: ButtonSmall

  constructor(scene: Phaser.Scene, x: number, y: number, private content: Array<string>, onClose?: () => void) {
    super(scene, x, y, 'frame-char-dialog')
    this.scene = scene
    this.group = this.scene.add.group()
    this.group.add(this)
    scene.add.existing(this)

    this.setDepth(9)
    const { width, height } = scene.scale
    const background = scene.add.rectangle(width * 0.5, height * 0.5, 500, 500, 0x00000).setInteractive()
    background.setAlpha(0.5)
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)
    background.setDepth(8)
    this.group.add(background)

    this.text = scene.add
      .text(this.x - this.width * 0.44, this.y - this.height * 0.44, '', { font: '32px Arial' })
      .setDepth(9)
    this.text.setShadow(3, 3, 'rgba(0,0,0)', 5)

    this.group.add(this.text)

    this.closeButton = new ButtonSmall(scene, this.x + this.width * 0.45, this.y - this.height * 0.45, {
      name: BUTTON.CLOSE,
      prefix: BUTTON_PREFIX.BLOCKED,
      scale: {
        x: 0.3,
        y: 0.3,
      },
      onClick: () => {
        if (onClose) onClose()
        this.group.destroy(true)
      },
    }).setDepth(9)

    this.group.add(this.closeButton)

    this.nextLine()
  }

  nextLine = () => {
    if (this.lineIndex === this.content.length) {
      this.closeButton.changeTexture(BUTTON_PREFIX.NORMAL)
      return
    }

    this.line = this.content[this.lineIndex++].split(' ')
    this.wordIndex = 0

    this.scene.tweens.addCounter({
      duration: this.line.length * this.wordDelay,
      repeat: this.line.length,
      onRepeat: () => {
        this.nextWord()
      },
      ease: (v) => Phaser.Math.Easing.Stepped(v, this.line.length),
    })
  }

  nextWord = () => {
    this.text.text = this.text.text.concat(this.line[this.wordIndex] + ' ')
    this.wordIndex++

    //  Last word?
    if (this.wordIndex === this.line.length) {
      this.text.text = this.text.text.concat('\n')
      this.scene.time.delayedCall(this.lineDelay, this.nextLine)
    }
  }
}
