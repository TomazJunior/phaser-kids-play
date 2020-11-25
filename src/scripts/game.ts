import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import resize from './utils/resize'
import { GAME } from './utils/constants'
import MenuScene from './scenes/menuScene'
import { isAndroid, isLocalhost } from './utils/deviceUtils'
import LevelScene from './scenes/levelScene'
import PauseScene from './scenes/pauseScene'
import ConfigScene from './scenes/configScene'
import SelectItemsScene from './scenes/selectItemsScene'
import { setDeviceInfoConfig, setIsOnline } from './utils/deviceData'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.NONE,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
  },
  scene: [PreloadScene, PauseScene, ConfigScene, MenuScene, LevelScene, SelectItemsScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: isLocalhost(),
      gravity: { y: 0 },
    },
  },
}

const onPause = (game: Phaser.Game) => {
  if (!game) return
  game.sound.pauseAll()
}

const onResume = (game: Phaser.Game) => {
  // if (!game) return
  // game.sound.resumeAll()
}

const onOffline = (game: Phaser.Game) => {
  setIsOnline(false)
}

const onOnline = (game: Phaser.Game) => {
  setIsOnline(true)
}

const onDeviceReady = () => {
  setDeviceInfoConfig(window.device)

  document.addEventListener(
    'pause',
    () => {
      onPause(game)
    },
    false
  )

  document.addEventListener(
    'resume',
    () => {
      onResume(game)
    },
    false
  )

  document.addEventListener('offline', () => onOffline(game), false)
  document.addEventListener('online', () => onOnline(game), false)

  if (isAndroid()) {
    window.plugins.insomnia.keepAwake()
  } else {
    setIsOnline(false)
  }

  const game = new Phaser.Game(config)
  window.addEventListener('resize', () => {
    resize(game)
  })
  resize(game)
}

window.addEventListener('load', () => {
  if (isAndroid()) {
    document.addEventListener(
      'deviceready',
      () => {
        onDeviceReady()
      },
      true
    )
  } else {
    onDeviceReady()
  }
})
