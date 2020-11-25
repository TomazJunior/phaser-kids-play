import { getFileStorageConfig } from './gameInfoData'
import { SOUNDS } from './constants'

export const playSound = (scene: Phaser.Scene, audio: Phaser.Sound.BaseSound) => {
  if (!scene.sound.locked) {
    handlePlaySound(audio)
  } else {
    scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      handlePlaySound(audio)
    })
  }
}

const handlePlaySound = (audio: Phaser.Sound.BaseSound) => {
  const {sound, backgroudSound} = getFileStorageConfig()
  const isBgSound = audio.key === SOUNDS.BACKGROUND
  const shouldPlay = (sound && !isBgSound )|| (backgroudSound && isBgSound)
  if (!isBgSound && audio.isPlaying) audio.stop()
  if (shouldPlay) {
    audio.isPaused ? audio.resume() : audio.play()
  }
}

export const getOrAddAudio = (
  scene: Phaser.Scene,
  key: SOUNDS,
  config?: Phaser.Types.Sound.SoundConfig
): Phaser.Sound.BaseSound => {
  return scene.sound.get(key) || scene.sound.add(key, config)
}

export const updateSoundState = (scene: Phaser.Scene) => {
  const bgSound = getOrAddAudio(scene, SOUNDS.BACKGROUND)
  
  if (!scene.sound.locked) {
    handlUpdateSoundState(bgSound)
  } else {
    scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
      handlUpdateSoundState(bgSound)
    })
  }
}
const handlUpdateSoundState = (bgSound: Phaser.Sound.BaseSound) => {
  const { backgroudSound } = getFileStorageConfig()
  if (!backgroudSound) {
    bgSound.pause()
  }
}