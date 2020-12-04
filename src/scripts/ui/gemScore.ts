import { COLORS, FONTS, IN_APP_PURCHASED } from '../utils/constants'
import { isOnline } from '../utils/deviceData'
import { getGems, incPlayerGems, SetPlayerGems } from '../utils/gameProgressData'
import SyncData, { SyncDataOnProgress } from '../utils/syncData'
import { ButtonCircle } from './buttonCircle'
import { LoadingDialog } from './loadingDialog'
import { NoInternetDialog } from './noInternetDialog'

export class GemScore extends Phaser.GameObjects.Group {
  private _value: number
  private frame: Phaser.GameObjects.Sprite
  private addButton: ButtonCircle
  private valueText: Phaser.GameObjects.Text
  y: number
  isBuyingGem: boolean = false
  syncData: SyncData

  constructor(scene: Phaser.Scene, private x: number) {
    super(scene)
    scene.add.existing(this)
    this.syncData = new SyncData()
    this.y = -100
    this.frame = scene.add.sprite(x, this.y, 'gem-score')
    getGems().then((value: number) => {
      this._value = value

      this.valueText = scene.add
        .text(this.frame.x - this.frame.displayWidth * 0.5 + 90, this.y, this._value.toString(), {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '46px',
        })
        .setStroke(COLORS.DARK_YELLOW, 10)
        .setOrigin(0, 0.5)

      this.addButton = new ButtonCircle(
        scene,
        this.x + 120,
        this.y + 30,
        'circle-blue',
        '+',
        this.handleAddClick
      ).setVisible(false)

      this.add(this.frame).add(this.valueText).addMultiple(this.addButton.getChildren())
    })
  }

  private get value(): number {
    return this._value
  }

  private set value(v: number) {
    this._value = v
    this.valueText.text = v.toString()
  }

  async show() {
    this.value = await getGems()
    return new Promise((resolve) => {
      this.setVisible(true)
      this.scene.tweens.add({
        targets: this.getChildren(),
        duration: 500,
        y: '+=160',
        onComplete: () => {
          resolve()
        },
      })
    })
  }

  hide() {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        duration: 500,
        y: '-=160',
        onComplete: () => {
          this.setVisible(false)
          resolve()
        },
      })
    })
  }

  refreshValue = (): Promise<void> => {
    return new Promise(async (resolve) => {
      const currentValue = this._value
      const updatedValue = await getGems()

      this.scene.tweens.addCounter({
        from: currentValue,
        to: updatedValue,
        duration: 250,
        onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
          this.value = Math.trunc(value)
        },
        onComplete: () => {
          this.value = updatedValue
          resolve()
        },
      })
    })
  }

  incValue = async (value: number) => {
    await incPlayerGems(value)
    this.value = await getGems()
  }

  setGemValue = async (value: number) => {
    await SetPlayerGems(value)
    this.value = await getGems()
  }

  handleAddClick = async (): Promise<void> => {
    if (this.isBuyingGem) return Promise.resolve()
    this.isBuyingGem = true
    const { width, height } = this.scene.scale
    if (!isOnline()) {
      new NoInternetDialog(this.scene, width * 0.5, height * 0.5, () => {
        this.isBuyingGem = false
      })
    } else {
      const loadingData = new LoadingDialog(this.scene, width * 0.5, height * 0.5, ['Syncing your', 'progress'], true)
      await this.syncData.sync(
        async (syncDataProgress: SyncDataOnProgress): Promise<void> => {
          loadingData.content = syncDataProgress.stepText
          if (syncDataProgress.gems) {
            await this.setGemValue(syncDataProgress.gems)
          }
          if (syncDataProgress.done) loadingData.close()
          return Promise.resolve()
        }
      )
      // this.renderInAppPurchase()
    }
    return Promise.resolve()
  }

  showAddButton = (visible: boolean) => {
    this.addButton.setVisible(visible)
  }

  //TODO: finish the store mechanism
  renderInAppPurchase = () => {
    if (!window.store) {
      alert('Store not available')
      console.log('Store not available')
      this.isBuyingGem = false
      return
    }

    const render = () => {
      // Get the product from the pool.
      var product = window.store.get(IN_APP_PURCHASED.GEMS_1000)
      alert('product =>' + JSON.stringify(product))
    }

    render()
    window.store.when(IN_APP_PURCHASED.GEMS_1000).updated(render)
    window.store.off(() => {
      alert('store.off called')
      console.log('store.off called')
      this.isBuyingGem = false
    })
  }
}
