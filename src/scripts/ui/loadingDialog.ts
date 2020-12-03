import { OBJECT_DEPTHS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class LoadingDialog extends Phaser.GameObjects.Group {
  private frame: Phaser.GameObjects.Image
  private contentText: Phaser.GameObjects.Text
  private tweens: Array<Phaser.Tweens.Tween> = []

  wordDelay = 25
  lineDelay = 75
  closeButton: ButtonSmall | undefined
  isClosing: boolean = false
  private _content: Array<string>

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: Array<string>,
    hideBackground: boolean = false,
    size?: { width: number; height: number }
  ) {
    super(scene)
    this.scene = scene
    this.frame = scene.add.image(x, y, 'frame-loading-dialog')
    this.content = content
    scene.add.existing(this)
    this.add(this.frame)

    if (size) {
      this.frame.setDisplaySize(size.width, size.height)
    }

    this.setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
    const { width, height } = scene.scale
    if (hideBackground) {
      const background = scene.add.rectangle(width * 0.5, height * 0.5, 500, 500, 0x00000).setInteractive()
      background.setAlpha(0.5)
      let scaleX = width / background.width
      let scaleY = height / background.height
      let scale = Math.max(scaleX, scaleY)
      background.setScale(scale).setScrollFactor(0)
      background.setDepth(OBJECT_DEPTHS.BACKGROUND)
      this.add(background)
    }

    this.contentText = scene.add
      .text(this.frame.x - this.frame.displayWidth * 0.5 + 65, this.frame.y - 70, content, {
        font: '26px Arial',
      })
      .setStroke('#bb956d', 10)
      .setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
      .setOrigin(0, 0)

    this.add(this.contentText)

    let threeDotsText = '...'
    const threeDotsTween = this.scene.tweens.add({
      targets: this.contentText,
      alpha: 1,
      duration: 100,
      repeat: -1,
      yoyo: true,
      onYoyo: () => {
        if (this.isClosing) return
        if (threeDotsText.length === 3) {
          threeDotsText = ''
        } else {
          threeDotsText += '.'
        }
        const lines = [...this._content]
        lines[lines.length - 1] = `${lines[lines.length - 1]} ${threeDotsText}`
        this.contentText.setText(lines)
      },
    })
    this.tweens.push(threeDotsTween)
  }

  public set content(v: Array<string>) {
    if (this.isClosing) return
    this._content = v
  }

  close = () => {
    this.isClosing = true
    this.tweens.filter((tween) => tween.isPlaying()).forEach((tween) => tween.complete())
    this.destroy(true)
  }
}
