import { OBJECT_DEPTHS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class LoadingDialog extends Phaser.GameObjects.Group {
  private frame: Phaser.GameObjects.Image
  private text: Phaser.GameObjects.Text
  private tweens: Array<Phaser.Tweens.Tween> = []

  wordDelay = 25
  lineDelay = 75
  closeButton: ButtonSmall | undefined

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: string,
    hideBackground: boolean = false,
    size?: { width: number; height: number }
  ) {
    super(scene)
    this.scene = scene
    this.frame = scene.add.image(x, y, 'frame-char-dialog')

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

    this.text = scene.add
      .text(this.frame.x, this.frame.y, content, {
        font: '26px Arial',
      })
      .setStroke('#bb956d', 10)
      .setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
      .setOrigin(0.5, 0.5)

    this.add(this.text)

    const threeDotsText = scene.add
      .text(this.text.x + this.text.displayWidth * 0.5 + 10, this.frame.y, '...', {
        font: '26px Arial',
      })
      .setStroke('#bb956d', 10)
      .setDepth(OBJECT_DEPTHS.FRAME_DIALOG)
      .setOrigin(0, 0.5)

    this.add(threeDotsText)

    const threeDotsTween = this.scene.tweens.add({
      targets: threeDotsText,
      alpha: 1,
      duration: 100,
      repeat: -1,
      yoyo: true,
      onYoyo: () => {
        if (threeDotsText.text.length === 3) {
          threeDotsText.text = ''
        } else {
          threeDotsText.text = threeDotsText.text + '.'
        }
      },
    })
    this.tweens.push(threeDotsTween)
  }

  close = () => {
    this.tweens.filter((tween) => tween.isPlaying()).forEach((tween) => tween.complete())
    this.destroy(true)
  }
}
