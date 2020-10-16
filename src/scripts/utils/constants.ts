export const SCORE_PER_HIDDEN_CHAR = 10

export const BOX = {
  width: 64,
  height: 64,
  scale: 2.5,
  SKINS: {
    DEFAULT: 6,
    SELECTED: 9,
    WRONG: 7,
    RIGHT: 8,
  },
}

export const LEVELS = [
  { level: 1, from: 1, to: 2, hiddens: 1 },
  { level: 2, from: 3, to: 7, hiddens: 2 },
  { level: 3, from: 8, to: 10, hiddens: 3 },
  { level: 4, from: 11, to: 13, hiddens: 4 },
  { level: 5, from: 14, to: 15, hiddens: 5 },
  { level: 5, from: 16, to: 18, hiddens: 6 },
]

export const MAP = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
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

export const FONTS = {
  PIXEL_FONT: 'pixelFont',
  SHORT_STACK: 'shortStack',
  ALLOY_INK: 'AlloyInk',
}

export enum IMAGE_NAME {
  FINGER_POINT = 'finger-point',
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
