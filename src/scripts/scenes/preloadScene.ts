import { SPRITE_NAME } from "../utils/constants";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
	this.load.image('background', 'assets/img/MlQA2U.jpg');
    this.load.spritesheet(SPRITE_NAME.SOKOBAN, 'assets/img/sokoban_tilesheet.png', {
      frameWidth: 64
	})
	this.load.atlasXML(SPRITE_NAME.ROUND_ANIMALS, 'assets/img/round_nodetailsOutline.png', 'assets/img/round_nodetailsOutline.xml');
  }

  create() {
    this.createAnimations()
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }

  createAnimations() {
    this.anims.create({
			key: 'down-idle',
			frames: [{ key: 'sokoban', frame: 52 }]
		})

		this.anims.create({
			key: 'down-walk',
			frames: this.anims.generateFrameNumbers('sokoban', { start: 52, end: 54 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'up-idle',
			frames: [{ key: 'sokoban', frame: 55 }]
		})

		this.anims.create({
			key: 'up-walk',
			frames: this.anims.generateFrameNumbers('sokoban', { start: 55, end: 57 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'left-idle',
			frames: [{ key: 'sokoban', frame: 81 }]
		})

		this.anims.create({
			key: 'left-walk',
			frames: this.anims.generateFrameNumbers('sokoban', { start: 81, end: 83 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'right-idle',
			frames: [{ key: 'sokoban', frame: 78 }]
		})

		this.anims.create({
			key: 'right-walk',
			frames: this.anims.generateFrameNumbers('sokoban', { start: 78, end: 80 }),
			frameRate: 10,
			repeat: -1
		})
  }
}
