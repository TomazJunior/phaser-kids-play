import { SOUNDS } from './constants'

export const playSound = (scene: Phaser.Scene, audio: Phaser.Sound.BaseSound) => {
  if (!scene.sound.locked) {
    if (audio.isPlaying) audio.stop()
    audio.play()
  } else {
    scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      audio.play()
    })
  }
}

export const getOrAddAudio = (
  scene: Phaser.Scene,
  key: SOUNDS,
  config?: Phaser.Types.Sound.SoundConfig
): Phaser.Sound.BaseSound => {
  return scene.sound.get(key) || scene.sound.add(key, config)
}

export const changeSoundState = (scene: Phaser.Scene, soundEnabled: boolean) => {
  if (!scene.sound.locked) {
    scene.sound.mute = !soundEnabled
  } else {
    scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      scene.sound.mute = !soundEnabled
    })
  }
}
