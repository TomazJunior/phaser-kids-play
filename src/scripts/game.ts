import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import resize from './utils/resize'
import { GAME } from './utils/constants'
import MenuScene from './scenes/menuScene'
import { isAndroid } from './utils/device'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.NONE,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
  },
  scene: [PreloadScene, MenuScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: isLocalhost,
      gravity: { y: 0 },
    },
  },
}

const onPause = (game: Phaser.Game) => {
  if (!game) return
  game.sound.pauseAll()
}

const onResume = (game: Phaser.Game) => {
  if (!game) return
  game.sound.resumeAll()
}

const onDeviceReady = () => {
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

  if (isAndroid()) {
    window.plugins.insomnia.keepAwake()
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
