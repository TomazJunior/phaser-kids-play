
export default class ProgressBar extends Phaser.GameObjects.Container {
  graphics: Phaser.GameObjects.Graphics
  newGraphics: Phaser.GameObjects.Graphics
  loadingText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)

    this.graphics = scene.add.graphics()
    this.newGraphics = scene.add.graphics()
    var progressBar = new Phaser.Geom.Rectangle(0, 0, 400, 50)
    var progressBarFill = new Phaser.Geom.Rectangle(5, 5, 290, 40)

    this.graphics.fillStyle(0xffffff, 1)
    this.graphics.fillRectShape(progressBar)

    this.newGraphics.fillStyle(0x3587e2, 1)
    this.newGraphics.fillRectShape(progressBarFill)

    this.loadingText = scene.add.text(50, 60, 'Loading: ', { fontSize: '32px', fill: '#FFF' })

    this.add(this.graphics).add(this.newGraphics).add(this.loadingText)
  }

  updateValue = (percentage: number) => {
    this.newGraphics.clear()
    this.newGraphics.fillStyle(0x3587e2, 1)
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(5, 5, percentage * 390, 40))

    percentage = percentage * 100
    this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%')
  }

  complete = () => {}
}
