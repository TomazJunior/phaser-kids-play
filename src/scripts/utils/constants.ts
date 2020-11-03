import { PlayerMario } from '../objects/playerMario'
import { Box } from '../objects/box'

export enum SCENES {
  LEVEL_SCENE = 'LevelScene',
  MAIN_SCENE = 'MainScene',
  MENU_SCENE = 'MenuScene',
  PAUSE_SCENE = 'PauseScene',
  PRELOAD_SCENE = 'PreloadScene',
}

export const SCORE_PER_HIDDEN_CHAR = 10
export const GAME_NAME = 'Find them all'
export enum TILES {
  GROUND = 0x00,
  BOX = 0x01,
  PLAYER = 0x03,
  GRASS_TOP_LEFT = 0x08,
  DIRT_LEFT = 0x09,
  DIRT_RIGHT = 0x10,
  DIRT_TOP = 0x11,
  DIRT_DOWN = 0x12,
  DIRT_RIGHT_BOTTOM = 0x13,
  DIRT_LEFT_BOTTOM = 0x14,
  DIRT_RIGHT_TOP = 0x15,
  DIRT_LEFT_TOP = 0x16,
  GRASS_TOP_RIGHT = 0x17,
  BLUE_BOX = 0x18,
  RED_BOX = 0x19,
  DOOR_MID = 0x30,
  DOOR_TOP = 0x31,
  SIGN_EXIT = 0x32,
  FLOWER_SIX_POINTS = 0x50,
  FLOWER_THREE_POINTS = 0x51,
  TREE_TINY = 0x60,
  TREE_BIG = 0x61,
  ROCK_BIG = 0x70,
  ROCK_SMALL = 0x71,
  ROCK_TINY = 0x72,
  INIT_POSITION = 0x90,
  FINAL_POSITION = 0x91,
}

export const SPRITE_NAME = {
  ROUND_ANIMALS: 'round_animals',
  SOKOBAN: 'sokoban',
}

export enum TileGameWorldType {
  PLAYER,
  TARGET,
  TILE,
}

export const GAME_WORLDS: Array<GameWorld> = [
  {
    key: '1',
    name: 'World 1',
    playerClazz: PlayerMario,
    targetClazz: Box,
    levels: [
      { level: 1, rounds: 5, hiddens: 1, tutorial: { text: ['Hi there :-)', 'Please, help me!', 'Need to find the animals.'] } },
      { level: 2, rounds: 5, hiddens: 2, tutorial: { text: ['Hi there :-)', 'Please, find them!', 'In the correct order.'] } },
      { level: 3, rounds: 5, hiddens: 3 },
      { level: 4, rounds: 5, hiddens: 4 },
      { level: 5, rounds: 5, hiddens: 5 },
      { level: 6, rounds: 5, hiddens: 6 },
      { level: 7, rounds: 5, hiddens: 7 },
      { level: 8, rounds: 5, hiddens: 8 },
      { level: 9, rounds: 5, hiddens: 9 },
    ],
    tileConfig: {
      width: 64,
      height: 64,
      scale: 1.5,
    },
    tiles: [
      {
        name: 'Box',
        tile: TILES.BOX,
        collidable: true,
        textures: [{ texture: SPRITE_NAME.SOKOBAN, frame: '6' }],
        tileType: TileGameWorldType.TARGET,
      },
      {
        name: 'grass-top-left',
        tile: TILES.GRASS_TOP_LEFT,
        collidable: true,
        textures: [{ texture: 'world-2-grass-top-left' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'grass-top-right',
        tile: TILES.GRASS_TOP_RIGHT,
        collidable: true,
        textures: [{ texture: 'world-2-grass-top-right' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Grass',
        tile: TILES.GROUND,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Left',
        tile: TILES.DIRT_LEFT,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-left' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Right',
        tile: TILES.DIRT_RIGHT,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-right' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Top',
        tile: TILES.DIRT_TOP,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-top' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-bottom',
        tile: TILES.DIRT_DOWN,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-bottom' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-right-bottom',
        tile: TILES.DIRT_RIGHT_BOTTOM,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-right-bottom' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-LEFT-bottom',
        tile: TILES.DIRT_LEFT_BOTTOM,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-left-bottom' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-right-top',
        tile: TILES.DIRT_RIGHT_TOP,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-right-top' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-left-top',
        tile: TILES.DIRT_LEFT_TOP,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-left-top' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Rock-Big',
        tile: TILES.ROCK_BIG,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-rock-big' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Rock-Small',
        tile: TILES.ROCK_SMALL,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-rock-small' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Rock-tiny',
        tile: TILES.ROCK_TINY,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-rock-tiny' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Tree-tiny',
        tile: TILES.TREE_TINY,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-tree-tiny' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Tree-big',
        tile: TILES.TREE_BIG,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-tree-big' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Flower-Six-Grass',
        tile: TILES.FLOWER_SIX_POINTS,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-flower-six-points' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Flower-Three-Grass',
        tile: TILES.FLOWER_THREE_POINTS,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: 'world-2-flower-three-points' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Player',
        tile: TILES.PLAYER,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-bottom' }],
        tileType: TileGameWorldType.PLAYER,
      },
      {
        name: 'Init-Pos',
        tile: TILES.INIT_POSITION,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-bottom' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Final-Pos',
        tile: TILES.FINAL_POSITION,
        collidable: false,
        textures: [{ texture: 'world-2-dirt-bottom' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Door-top',
        tile: TILES.DOOR_TOP,
        collidable: false,
        textures: [{ texture: 'world-2-grass' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Door-mid',
        tile: TILES.DOOR_MID,
        collidable: false,
        textures: [{ texture: 'world-2-grass' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Sign-exit',
        tile: TILES.SIGN_EXIT,
        collidable: false,
        textures: [{ texture: 'world-2-grass' }, { texture: 'sign-exit' }],
        tileType: TileGameWorldType.TILE,
        angle: -20
      },
    ],
    map: [
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x61, 0x00, 0x00, 0x01, 0x00, 0x01, 0x71, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x08, 0x12, 0x12, 0x12, 0x12, 0x12, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x01, 0x10, 0x16, 0x11, 0x11, 0x11, 0x15, 0x09, 0x01, 0x51, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x71, 0x72, 0x10, 0x09, 0x01, 0x00, 0x01, 0x10, 0x09, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x70, 0x10, 0x09, 0x50, 0x51, 0x00, 0x10, 0x09, 0x00, 0x72, 0x51, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x60, 0x10, 0x09, 0x01, 0x51, 0x01, 0x10, 0x09, 0x01, 0x00, 0x32, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x03, 0x12, 0x12, 0x90, 0x13, 0x14, 0x12, 0x12, 0x12, 0x13, 0x14, 0x12, 0x12, 0x12, 0x12, 0x91, 0x12, 0x12, 0x12, 0x12, 0x12, ],
      [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, ],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
    ],
  },
  {
    key: '2',
    name: 'World 2',
    playerClazz: PlayerMario,
    targetClazz: Box,
    levels: [
      { level: 1, rounds: 5, hiddens: 1 },
      { level: 2, rounds: 5, hiddens: 2 },
      { level: 3, rounds: 5, hiddens: 3 },
      { level: 4, rounds: 5, hiddens: 4 },
      { level: 5, rounds: 5, hiddens: 5 },
      { level: 6, rounds: 5, hiddens: 6 },
      { level: 7, rounds: 5, hiddens: 7 },
      { level: 8, rounds: 5, hiddens: 8 },
      { level: 9, rounds: 5, hiddens: 9 },
    ],
    tileConfig: {
      width: 64,
      height: 64,
      scale: 1.5,
    },
    tiles: [
      {
        name: 'Box',
        tile: TILES.BOX,
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
        ],
        tileType: TileGameWorldType.TARGET,
      },
      {
        name: 'Gray-Ground',
        tile: TILES.GROUND,
        collidable: false,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
        ],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Blue-Box',
        tile: TILES.BLUE_BOX,
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
          { texture: SPRITE_NAME.SOKOBAN, frame: '8' },
        ],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Flower-Three-Grass',
        tile: TILES.FLOWER_THREE_POINTS,
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          }, 
          { 
            texture: 'world-2-flower-three-points' 
          }
        ],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Flower-Six-Grass',
        tile: TILES.FLOWER_SIX_POINTS,
        collidable: true,
        textures: [{
          texture: SPRITE_NAME.SOKOBAN,
          frame: '89',
        }, { texture: 'world-2-flower-six-points' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Player',
        tile: TILES.PLAYER,
        collidable: false,
        textures: [{ texture: SPRITE_NAME.SOKOBAN, frame: '89' }],
        tileType: TileGameWorldType.PLAYER,
      },
      {
        name: 'Init-Pos',
        tile: TILES.INIT_POSITION,
        collidable: false,
        textures: [{ texture: SPRITE_NAME.SOKOBAN, frame: '89' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Final-Pos',
        tile: TILES.FINAL_POSITION,
        collidable: false,
        textures: [{ texture: SPRITE_NAME.SOKOBAN, frame: '89' }],
        tileType: TileGameWorldType.TILE,
      },
    ],
    map: [
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x01, 0x18, 0x18, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x18, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x91, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    ],
  },
]

export const GAME = {
  WIDTH: 1280,
  HEIGHT: 720,
}

export const PLAYER = {
  ANIMATIONS: {
    DOWN_IDLE: 'down-idle',
    RIGHT_WALK: 'right-walk',
    LEFT_WALK: 'left-walk',
    UP_WALK: 'up-walk',
    DOWN_WALK: 'down-walk',
  },
}

export const FONTS = {
  PIXEL_FONT: 'pixelFont',
  ALLOY_INK: 'AlloyInk',
}

export enum SOUNDS {
  CLICK = 'click',
  BACKGROUND = 'background-sound',
  FIND_HIDDEN = 'find-hidden',
  NEXT_LEVEL = 'next-level',
  CLICK_TARGET = 'click-target',
  WRONG_TARGET = 'wrong-target',
  WALKING = 'walking',
  ENTER_THE_DOOR = 'enter-the-door',
  ENTER_THE_BOX = 'enter-the-box',
}

export enum IMAGE_NAME {
  FINGER_POINT = 'finger-point',
}

export enum BUTTON {
  LEFT = 'left-button',
  BIG_FRAME = 'big-frame-button',
  RESTART = 'restart-button',
  HOME = 'home-button',
  EMPTY = 'empty-button',
  LEVEL = 'level-button',
  RIGHT = 'right-button',
  SOUND = 'sound-button',
  SOUND_BG = 'sound-bg-button',
  PAUSE = 'pause-button',
  CLOSE = 'close-button',
}

export enum BUTTON_PREFIX {
  BLOCKED = 'blocked',
  NORMAL = 'normal',
}

export enum BUTTON_PREFIX_EXTRA {
  INACTIVE = 'inactive',
}

export enum ANIMAL_SKINS {
  BEAR = 'bear.png',
  BUFFALO = 'buffalo.png',
  CHICK = 'chick.png',
  CHICKEN = 'chicken.png',
  COW = 'cow.png',
  CROCODILE = 'crocodile.png',
  DOG = 'dog.png',
  DUCK = 'duck.png',
  ELEPHANT = 'elephant.png',
  FROG = 'frog.png',
  GIRAFFE = 'giraffe.png',
  GOAT = 'goat.png',
  GORILLA = 'gorilla.png',
  HIPPO = 'hippo.png',
  HORSE = 'horse.png',
  MONKEY = 'monkey.png',
  MOOSE = 'moose.png',
  NARWHAL = 'narwhal.png',
  OWL = 'owl.png',
  PANDA = 'panda.png',
  PARROT = 'parrot.png',
  PENGUIN = 'penguin.png',
  PIG = 'pig.png',
  RABBIT = 'rabbit.png',
  RHINO = 'rhino.png',
  SLOTH = 'sloth.png',
  SNAKE = 'snake.png',
  WALRUS = 'walrus.png',
  WHALE = 'whale.png',
  ZEBRA = 'zebra.png',
}
