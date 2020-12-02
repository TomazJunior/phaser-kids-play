import { SPRITE_NAME } from "./constants"

export const createAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'throw',
    frames: scene.anims.generateFrameNumbers('firework', { start: 0, end: 30 }),
    frameRate: 15,
    showOnStart: true,
    hideOnComplete: true,
  })

  scene.anims.create({
    key: 'down-idle',
    frames: [{ key: SPRITE_NAME.SOKOBAN, frame: 52 }],
  })

  scene.anims.create({
    key: 'down-walk',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAME.SOKOBAN, { start: 52, end: 54 }),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'up-idle',
    frames: [{ key: SPRITE_NAME.SOKOBAN, frame: 55 }],
  })

  scene.anims.create({
    key: 'up-walk',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAME.SOKOBAN, { start: 55, end: 57 }),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'left-idle',
    frames: [{ key: SPRITE_NAME.SOKOBAN, frame: 81 }],
  })

  scene.anims.create({
    key: 'left-walk',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAME.SOKOBAN, { start: 81, end: 83 }),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'right-idle',
    frames: [{ key: SPRITE_NAME.SOKOBAN, frame: 78 }],
  })

  scene.anims.create({
    key: 'right-walk',
    frames: scene.anims.generateFrameNumbers(SPRITE_NAME.SOKOBAN, { start: 78, end: 80 }),
    frameRate: 10,
    repeat: -1,
  })
}
