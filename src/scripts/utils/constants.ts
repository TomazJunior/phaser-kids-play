export const BOX = {
    width: 64,
    height: 64,
    scale: 2.5,
    SKINS: {
        DEFAULT: 6,
        SELECTED: 9,
        WRONG: 7,
        RIGHT: 8
    }
}

export const LEVELS = [
    {level: 1, from: 1, to: 5, hiddens: 1},
    {level: 2, from: 6, to: 10, hiddens: 2},
    {level: 3, from: 11, to: 15, hiddens: 3}
]

export const GAME = {
    WIDTH: 1280,
    HEIGHT: 720,
};

export const PLAYER = {
    ANIMATIONS: {
        DOWN_IDLE: 'down-idle',
        RIGHT_WALK: 'right-walk',
        LEFT_WALK: 'left-walk',
        UP_WALK: 'up-walk',
        DOWN_WALK: 'down-walk'
    }
}

export const SPRITE_NAME = {
    BLUE_SHEET: 'blueSheet',
    WHITE_SHEET: 'whiteSheet',
    ROUND_ANIMALS: 'round_animals',
    SOKOBAN: 'sokoban',
    SHORT_STACK: 'shortStack'
}

export enum SKINS {
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
    ZEBRA = 'zebra.png'
}
