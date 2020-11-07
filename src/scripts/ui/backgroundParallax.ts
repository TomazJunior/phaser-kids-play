import { FONTS, GAME, GAME_NAME } from '../utils/constants'

export default class BackgroundParallax extends Phaser.GameObjects.TileSprite {
  private _title: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, private showTitle: boolean = true, private enableParallax: boolean = true) {
    super(scene, 0, 0, GAME.WIDTH, GAME.HEIGHT, 'background')
    this.scene.add.existing(this)
    this.setOrigin(0)

    const { width, height } = scene.scale
    let scaleX = width / this.width
    let scaleY = height / this.height
    let scale = Math.max(scaleX, scaleY)
    this.setScale(scale).setScrollFactor(0)

    if (showTitle) {
      this._title = scene.add
        .text(width * 0.5, height * 0.3, GAME_NAME, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '156px',
          color: 'yellow',
        })
        .setOrigin(0.5, 0.5)
        .setStroke('#000', 10)
    }

    scene.events.on('update', this.update, this)
  }

  update() {
    if (this.enableParallax) {
      this.tilePositionX += 5
    }
  }

  public get title(): Phaser.GameObjects.Text {
    return this._title
  }
}
