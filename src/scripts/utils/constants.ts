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
  GRASS = 0x00,
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
  BLUE_BOX = 0X18
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
    name: 'world-1',
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
        texture: SPRITE_NAME.SOKOBAN,
        frame: '6',
        tileType: TileGameWorldType.TARGET,
      },
      {
        name: 'grass-top-left',
        tile: TILES.GRASS_TOP_LEFT,
        collidable: true,
        texture: 'world-2-grass-top-left',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'grass-top-right',
        tile: TILES.GRASS_TOP_RIGHT,
        collidable: true,
        texture: 'world-2-grass-top-right',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Grass',
        tile: TILES.GRASS,
        collidable: true,
        texture: 'world-2-grass',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Left',
        tile: TILES.DIRT_LEFT,
        collidable: false,
        texture: 'world-2-dirt-left',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Right',
        tile: TILES.DIRT_RIGHT,
        collidable: false,
        texture: 'world-2-dirt-right',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-Top',
        tile: TILES.DIRT_TOP,
        collidable: false,
        texture: 'world-2-dirt-top',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-bottom',
        tile: TILES.DIRT_DOWN,
        collidable: false,
        texture: 'world-2-dirt-bottom',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-right-bottom',
        tile: TILES.DIRT_RIGHT_BOTTOM,
        collidable: false,
        texture: 'world-2-dirt-right-bottom',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-LEFT-bottom',
        tile: TILES.DIRT_LEFT_BOTTOM,
        collidable: false,
        texture: 'world-2-dirt-left-bottom',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-right-top',
        tile: TILES.DIRT_RIGHT_TOP,
        collidable: false,
        texture: 'world-2-dirt-right-top',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Dirt-left-top',
        tile: TILES.DIRT_LEFT_TOP,
        collidable: false,
        texture: 'world-2-dirt-left-top',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Player',
        tile: TILES.PLAYER,
        collidable: false,
        texture: 'world-2-dirt-bottom',
        tileType: TileGameWorldType.PLAYER,
      },
    ],
    map: [
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x08, 0x12, 0x12, 0x12, 0x12, 0x12, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x01, 0x10, 0x16, 0x11, 0x11, 0x11, 0x15, 0x09, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x10, 0x09, 0x01, 0x00, 0x01, 0x10, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x10, 0x09, 0x00, 0x00, 0x00, 0x10, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x00, 0x00, 0x00, 0x00, 0x10, 0x09, 0x01, 0x00, 0x01, 0x10, 0x09, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
      [0x12, 0x12, 0x12, 0x03, 0x13, 0x14, 0x12, 0x12, 0x12, 0x13, 0x14, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, 0x12, ],
      [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, ],
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, ],
    ],
  },
  {
    name: 'world-2',
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
        texture: SPRITE_NAME.SOKOBAN,
        frame: '6',
        tileType: TileGameWorldType.TARGET,
      },
      {
        name: 'Gray-Ground',
        tile: TILES.GRASS,
        collidable: false,
        texture: SPRITE_NAME.SOKOBAN,
        frame: '89',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Blue-Box',
        tile: TILES.BLUE_BOX,
        collidable: true,
        texture: SPRITE_NAME.SOKOBAN,
        frame: '8',
        tileType: TileGameWorldType.TILE,
      },
      {
        name: 'Player',
        tile: TILES.PLAYER,
        collidable: false,
        texture: SPRITE_NAME.SOKOBAN,
        frame: '89',
        tileType: TileGameWorldType.PLAYER,
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
      [0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
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
