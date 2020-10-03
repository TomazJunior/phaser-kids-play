import Player from '../objects/player'
import Box from '../objects/box'
import HiddenChar from '../objects/hiddenChar'
import { HIDDEN_CHAR_REACHED_BOX, PLAYER_CHAR_REACHED_BOX, PLAYER_TOUCHED_BOX } from '../events/events'
import { getRandomSkin } from '../utils/skinUtils'
import { SKINS, SPRITE_NAME } from '../utils/constants'
import { Dialog, Label, RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

const level = [
	[1, 0, 3],
	[2, 4, 1],
	[3, 4, 2]
]

export default class MainScene extends Phaser.Scene {
  boxes: Phaser.Physics.Arcade.StaticGroup
  player: Player
  hiddenChar: HiddenChar
  activeBox: Box
  currentHiddenSkin: SKINS
  gameover = false

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.gameover = false    
  }

  create() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background');
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)

    background.setScale(scale).setScrollFactor(0)

    this.player = new Player(this, width * 0.1, height * 0.95);
    this.player
    .on(PLAYER_CHAR_REACHED_BOX, this.handleReachedBox);
    
    this.currentHiddenSkin = getRandomSkin();

    this.add.sprite(width * 0.5, 40, SPRITE_NAME.ROUND_ANIMALS, this.currentHiddenSkin)
      .setOrigin(0.5).setScale(0.5);

    this.createBoxes()
    this.hiddenChar = new HiddenChar(this, width * 0.05, height * 0.1, this.currentHiddenSkin);
    this.hiddenChar
    .on(HIDDEN_CHAR_REACHED_BOX, this.activateUser);

    this.physics.add.collider(this.player, this.boxes, undefined, undefined, this)
    this.physics.add.collider(this.hiddenChar, this.boxes, undefined, undefined, this)

    const randomBoxPos = Math.floor(Math.random() * 8);
    const box = <Box>this.boxes.children.getArray()[randomBoxPos];
    this.hiddenChar.goTo(box);
  }

  //TODO: improve it, move to a class
  createDialog = () => {
    const { width, height } = this.scale
    const dialog = new Dialog(this, {
      x: width * 0.5,
      y: height * 0.5,
      width: width * 0.5,
      height: height * 0.5,
      background: this.add.image(width * 0.5, height * 0.5, 'modalbg').setOrigin(0.5),//this.add.existing(new RoundRectangle(this, 400, 300, width, height, 20, 0x1565c0)),
      content: this.add.bitmapText(0, 0, 'shortStack', 'You Win!', 82),
      name: 'test',
      actions: [
        this.createLabel('Home'),
        this.createLabel('Restart'),
        this.createLabel('Next Level')
      ],
      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
      align: {
        actions: 'right', // 'center'|'left'|'right'
      },
      expand: {
        content: false,  // Content is a pure text object
      }
    });

    dialog
    .layout()
    .popUp(1000)
    .on('button.click', (button, groupName, index, pointer, event) => {
      //TODO: improve it
      if (this.gameover) return
      this.gameover = true;
      this.player.active = false;
      this.player.visible = false
      this.time.delayedCall(200, () => {
        this.scene.restart()
      });  
    }, this)
    .on('button.over', (button, groupName, index, pointer, event) => {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', (button, groupName, index, pointer, event) => {
        button.getElement('background').setStrokeStyle();
    });
  }

  createLabel = (text) => {
    return new Label(this, {
      background: this.add.existing(new RoundRectangle(this, 0, 0, 0, 0, 20, 0x5e92f3)),
      
      text: this.add.text(0, 0, text, {
        fontFamily: 'AlloyInk',  
        fontSize: '46px'
      }),

      space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
      }
    });
}

  update() {
    if (this.gameover) return
  }

  createBoxes = () =>
	{
    this.boxes = this.physics.add.staticGroup()
		const width = this.scale.width
		let xPer = 0.25
    let y = 250
    let id = 0
		for (let row = 0; row < level.length; ++row)
		{
			for (let col = 0; col < level[row].length; ++col)
			{
        const box = new Box(this, width * xPer, y, level[row][col], this.boxes, ++id)
        box.on(PLAYER_TOUCHED_BOX, this.handlePlayerGoToBox)
        xPer += 0.25
			}

			xPer = 0.25
			y += 200
    }
  }
  
  handlePlayerGoToBox = (box: Box) => {
    this.player.goTo(box)
  }

  activateUser = () => {
    this.player.active = true
  }

  handleReachedBox = (box: Box) => {
    this.time.delayedCall(100, () => {
      this.openBox(box)
    })
    
  }

  openBox = (box: Box) => {
    this.player.active = false
    if (!box.hiddenCharName) {
      box.isWrongBox()
      this.time.delayedCall(1000, () => {
        box.reset()
        this.player.active = true
      })
    } else {
      box.isRightBox()
      const { width, height } = this.scale
      this.tweens.add({
        targets: this.hiddenChar,
        y: '-=50',
        alpha: 1,
        scale: 1,
        duration: 500,
        onComplete: () => {
          this.hiddenChar.visible = true;
          this.createDialog()
        }
      })
    }
  }
}
