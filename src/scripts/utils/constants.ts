export const SCORE_PER_HIDDEN_CHAR = 10
export const GAME_NAME = 'Find them all'
export const BOX = {
  width: 101,
  height: 171,
  scale: 1,
  SKINS: {
    OPENED: 'chest-opened',
    CLOSED: 'chest-closed'
  },
}

export const LEVELS: Array<Level> = [
  { level: 1, rounds: 5, hiddens: 1 },
  { level: 2, rounds: 5, hiddens: 2 },
  { level: 3, rounds: 5, hiddens: 3 },
  { level: 4, rounds: 5, hiddens: 4 },
  { level: 5, rounds: 5, hiddens: 5 },
  { level: 6, rounds: 5, hiddens: 6 },
  { level: 7, rounds: 5, hiddens: 7 },
  { level: 8, rounds: 5, hiddens: 8 },
  { level: 9, rounds: 5, hiddens: 9 },
]

export const MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

export const SPRITE_NAME = {
  BLUE_SHEET: 'blueSheet',
  WHITE_SHEET: 'whiteSheet',
  ROUND_ANIMALS: 'round_animals',
  SOKOBAN: 'sokoban',
}

export enum TILES {
  GRASS = 0,
  BOX = 1,
  DIRT = 2,
  PLAYER = 3
}

export const FONTS = {
  PIXEL_FONT: 'pixelFont',
  SHORT_STACK: 'shortStack',
  ALLOY_INK: 'AlloyInk',
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
  RIGHT = 'right-button'
}

export enum BUTTON_PREFIX {
  BLOCKED = 'blocked',
  NORMAL = 'normal',
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
