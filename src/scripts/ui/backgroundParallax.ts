import { FPSController } from '../controllers/fpsController'
import { FONTS, GAME, GAME_NAME } from '../utils/constants'

export default class BackgroundParallax extends Phaser.GameObjects.TileSprite {
  private _title: Phaser.GameObjects.Text
  private background: Phaser.GameObjects.Image
  frameTime: number = 0
  gameTick: number = 0
  isClosing: boolean

  constructor(scene: Phaser.Scene, showTitle: boolean = true, private enableParallax: boolean = true) {
    super(
      scene,
      scene.scale.width * 0.5,
      scene.scale.height * 0.5,
      GAME.WIDTH,
      GAME.HEIGHT,
      'background-forest-2nd-layer'
    )
    this.scene = scene
    this.scene.add.existing(this)

    const { width, height } = scene.scale
    let scaleX = width / this.width
    let scaleY = height / this.height
    let scale = Math.max(scaleX, scaleY)
    this.setScale(scale).setScrollFactor(0)

    this.createBackground()

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

  update(time, delta) {

    const config: string | Phaser.Types.Scenes.SettingsConfig = this.scene?.sys?.config
    const key = !config ? '' : typeof config === 'string' ? config : config.key

    if (this.isClosing || !key || !this.scene.scene.isActive(key)) return

    if (
      !FPSController.getInstance().shouldUpdate(key, delta)
    ) {
      return
    }

    if (this.enableParallax) {
      this.tilePositionX += 5
    }
  }

  public get title(): Phaser.GameObjects.Text {
    return this._title
  }

  private createBackground = () => {
    const { width, height } = this.scene.scale

    this.background = this.scene.add.image(width * 0.5, height * 0.5, 'background-forest')
    let scaleX = width / this.background.width
    let scaleY = height / this.background.height
    let scale = Math.max(scaleX, scaleY)
    this.background.setScale(scale).setScrollFactor(0)
  }

  public close() {
    this.isClosing = true
    this.title?.destroy(true)
    this.background.destroy(true)
    this.destroy(true)
  }
}
