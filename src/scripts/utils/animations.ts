export const createAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'throw',
    frames: scene.anims.generateFrameNumbers('firework', { start: 0, end: 30 }),
    frameRate: 15,
    showOnStart: true,
    hideOnComplete: true,
  })
}
