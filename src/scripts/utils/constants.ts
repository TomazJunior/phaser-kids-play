import { PlayerMario } from '../objects/playerMario'
import { Box } from '../objects/box'
import { maps } from './maps'

export enum SCENES {
  CONFIG_SCENE = 'ConfigScene',
  LEVEL_SCENE = 'LevelScene',
  MAIN_SCENE = 'MainScene',
  MENU_SCENE = 'MenuScene',
  PAUSE_SCENE = 'PauseScene',
  PRELOAD_SCENE = 'PreloadScene',
}
export const MAX_TIMER_DURATION = 60
export const SCORE_PER_HIDDEN_CHAR = 10
export const BEST_TIME_BY_BOX_IN_SEC = 1
export const MINIMUM_ROUNDS_TO_GAIN_ONE_STAR = 2
export const MINIMUM_ROUNDS_TO_GAIN_TWO_STARS = 3
export const SCORE_BY_STAR = {
  1: 5,
  2: 10,
  3: 15,
}

export enum OBJECT_DEPTHS {
  MAP = 0,
  TARGET = 1,
  TARGET_SHADOW = 2,
  TARGET_QUEUE_POSITION = 3,
  HIDDEN_CHAR = 5,
  HIDDEN_THUMB_CHAR = 10,
  BACKGROUND = 15,
  FRAME_DIALOG = 20,
  PLAYER = 25
}

export const GAME_NAME = 'Find them all'
export enum TILES {
  GROUND = 0x00,
  BOX = 0x01,
  PLAYER = 0x03,
  GROUND_PATH = 0x07,
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
  INTERMEDIATE_POSITION = 0x92,
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

//Oh no! Now it’s more than one! Could you please help me to find them in the correct order?
export const GAME_WORLDS: Array<GameWorld> = [
  {
    key: '1',
    name: 'World 1',
    playerClazz: PlayerMario,
    targetClazz: Box,
    levels: [
      {
        level: 1,
        rounds: 5,
        hiddens: 1,
        tutorial: { text: ['Hi there :-)', 'Please, help me!', 'Need to find the animals.'] },
      },
      {
        level: 2,
        rounds: 5,
        hiddens: 2,
        tutorial: {
          text: ['Oh no!', 'Now it’s more than one!', 'Could you please help me to find', 'them in the correct order?'],
        },
      },
      { level: 3, rounds: 5, hiddens: 3 },
      { level: 4, rounds: 5, hiddens: 3 },
      {
        level: 5,
        rounds: 5,
        hiddens: 3,
        tutorial: {
          text: [
            'Oh... look! They’re trying',
            'to trick us, adding more boxes!',
            'I\'m sure it won\'t be',
            'a problem for you...',
          ],
          showPointer: { col: 7, row: 1 },
        },
        tileOverride: [{ position: { col: 7, row: 1 }, tileName: 'fake-box' }],
      },
      {
        level: 6,
        rounds: 5,
        hiddens: 3,
        tileOverride: [
          { position: { col: 11, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 1 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 7,
        rounds: 5,
        hiddens: 3,
        tileOverride: [
          { position: { col: 11, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 1 }, tileName: 'fake-box' },
          { position: { col: 8, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 4 }, tileName: 'fake-box' },
        ],
      },
      { level: 8, rounds: 5, hiddens: 4, tileOverride: [{ position: { col: 11, row: 5 }, tileName: 'fake-box' }] },
      {
        level: 9,
        rounds: 5,
        hiddens: 4,
        tileOverride: [
          { position: { col: 11, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 1 }, tileName: 'fake-box' },
          { position: { col: 8, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 4 }, tileName: 'fake-box' },
        ],
      },
      { level: 10, rounds: 5, hiddens: 5 },
      {
        level: 11,
        rounds: 5,
        hiddens: 5,
        tileOverride: [
          { position: { col: 11, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 1 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 12,
        rounds: 5,
        hiddens: 5,
        tileOverride: [
          { position: { col: 11, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 1 }, tileName: 'fake-box' },
          { position: { col: 8, row: 5 }, tileName: 'fake-box' },
          { position: { col: 7, row: 4 }, tileName: 'fake-box' },
        ],
      },
    ],
    tileConfig: {
      width: 64,
      height: 64,
      scale: 1.5,
    },
    tiles: [
      {
        name: 'box',
        tile: TILES.BOX,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: SPRITE_NAME.SOKOBAN, frame: '6' }],
        tileType: TileGameWorldType.TARGET,
      },
      {
        name: 'fake-box',
        tile: TILES.BLUE_BOX,
        collidable: true,
        textures: [{ texture: 'world-2-grass' }, { texture: SPRITE_NAME.SOKOBAN, frame: '8' }],
        tileType: TileGameWorldType.TILE,
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
        name: 'Inter-Pos',
        tile: TILES.INTERMEDIATE_POSITION,
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
        angle: -20,
      },
    ],
    map: maps[0],
  },
  {
    key: '2',
    name: 'World 2',
    playerClazz: PlayerMario,
    targetClazz: Box,
    levels: [
      {
        level: 1,
        rounds: 5,
        hiddens: 1,
        extraHiddens: 1,
        tutorial: {
          text: ['Hi there :-)', 'Have you seen an', 'animal going to the door?', "Don't worry about it", "It's safe."],
        },
      },
      {
        level: 2,
        rounds: 5,
        hiddens: 3,
        extraHiddens: 1,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 3,
        rounds: 5,
        hiddens: 3,
        extraHiddens: 2,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 4,
        rounds: 5,
        hiddens: 3,
        extraHiddens: 3,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 5,
        rounds: 5,
        hiddens: 4,
        extraHiddens: 3,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
          { position: { col: 5, row: 6 }, tileName: 'fake-box' },
          { position: { col: 10, row: 5 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 6,
        rounds: 5,
        hiddens: 4,
        extraHiddens: 3,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
          { position: { col: 5, row: 6 }, tileName: 'fake-box' },
          { position: { col: 10, row: 5 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 7,
        rounds: 5,
        hiddens: 5,
        extraHiddens: 3,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 8,
        rounds: 5,
        hiddens: 5,
        extraHiddens: 3,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 9,
        rounds: 5,
        hiddens: 5,
        extraHiddens: 4,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
          { position: { col: 5, row: 6 }, tileName: 'fake-box' },
          { position: { col: 10, row: 5 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 10,
        rounds: 5,
        hiddens: 5,
        extraHiddens: 4,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
          { position: { col: 8, row: 6 }, tileName: 'fake-box' },
          { position: { col: 9, row: 6 }, tileName: 'fake-box' },
          { position: { col: 5, row: 6 }, tileName: 'fake-box' },
          { position: { col: 10, row: 5 }, tileName: 'fake-box' },
        ],
      },
      {
        level: 11,
        rounds: 5,
        hiddens: 6,
        extraHiddens: 1,
      },
      {
        level: 12,
        rounds: 5,
        hiddens: 6,
        extraHiddens: 6,
        tileOverride: [
          { position: { col: 5, row: 4 }, tileName: 'fake-box' },
          { position: { col: 6, row: 4 }, tileName: 'fake-box' },
        ],
      },
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
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
        ],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Gray-Ground-Path',
        tile: TILES.GROUND_PATH,
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
        name: 'fake-box',
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
            texture: 'world-2-flower-three-points',
          },
        ],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Flower-Six-Grass',
        tile: TILES.FLOWER_SIX_POINTS,
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
          { texture: 'world-2-flower-six-points' },
        ],
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
      {
        name: 'Inter-Pos',
        tile: TILES.INTERMEDIATE_POSITION,
        collidable: false,
        textures: [{ texture: SPRITE_NAME.SOKOBAN, frame: '89' }],
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Door-top',
        tile: TILES.DOOR_TOP,
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
        name: 'Door-mid',
        tile: TILES.DOOR_MID,
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
        name: 'Sign-exit',
        tile: TILES.SIGN_EXIT,
        collidable: true,
        textures: [
          {
            texture: SPRITE_NAME.SOKOBAN,
            frame: '89',
          },
          { texture: 'sign-exit' },
        ],
        tileType: TileGameWorldType.TILE,
        angle: -20,
      },
    ],
    map: maps[1],
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
  CONFIG = 'config-button',
  INFO = 'info-button',
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

export enum COLORS {
  DARK_RED = '#901215',
  LIGHT_GREEN = '#63d31b',
  DARK_YELLOW = '#efb469',
}
