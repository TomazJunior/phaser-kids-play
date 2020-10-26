// import Player from '../src/scripts/objects/player';

// import Box from '../src/scripts/objects/box';

// import Player from '../src/scripts/objects/player';

// import Player from '../src/scripts/objects/player';

// import Player from '../src/scripts/objects/player';

declare interface ObjectPosition extends TilePosition {
  x: number
  y: number
}

declare interface TilePosition {
  row: number
  col: number
}

declare interface ButtonConfig {
  text?: {
    title?: string
    fontSize?: string
    padding?: {
      x?: number
      y?: number
    }
  }
  name?: import('../src/scripts/utils/constants').BUTTON
  prefix?:
    | import('../src/scripts/utils/constants').BUTTON_PREFIX
    | import('../src/scripts/utils/constants').BUTTON_PREFIX_EXTRA
  scale?: {
    x: number
    y: number
  }
  visible?: boolean
  onClick: () => void
}

declare interface FileStorageConfig {
  sound: boolean
  tutorials: Array<TutorialFileStorageConfig>
  levels: Array<LevelFileStorageConfig>
}

declare interface LevelFileStorageConfig {
  level: number
  stars: number
}

declare interface TutorialFileStorageConfig {
  level: number
  seen: boolean
}

declare interface Window {
  appConfig: any
  device: any
  StatusBar: any
  cordova: any
  plugins: any
}

declare interface GameWorld {
  name: string
  map: number[][]
  playerClazz: PlayerConstructor
  targetClazz: TargetConstructor
  levels: Array<Level>
  tileConfig: TileConfigGameWorld
  tiles: Array<TileGameWorld>
}

declare interface TileConfigGameWorld {
  width: number
  height: number
  scale: number
}

declare interface TileGameWorld {
  name: string
  collidable: boolean
  texture: string
  frame?: string
  tile: import('../src/scripts/utils/constants').TILES
  tileType: import('../src/scripts/utils/constants').TileGameWorldType
}

declare interface Level {
  level: number
  rounds: number
  hiddens: number
}

declare interface PauseSceneConfig {
  onHome: () => void
  onResume: () => void
  onRestart: () => void
}

declare interface MainSceneConfig {
  gameWorld: GameWorld
  level: Level
}

declare interface PlayerConstructor {
  new (scene: Phaser.Scene, objectPosition: ObjectPosition): PlayerInterface
}
declare interface PlayerInterface extends Phaser.Physics.Arcade.Sprite {
  objectPosition: ObjectPosition
  setIsGoingTo: (pathToGo: Array<ObjectPosition>, initialPos) => void
  goTo: (target: TargetInterface, pathToGo: Array<ObjectPosition>) => void
}

declare interface TargetConstructor {
  new (
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    container: Phaser.Physics.Arcade.StaticGroup,
    tileConfigGameWorld: TileConfigGameWorld
  ): TargetInterface
}

declare interface TargetInterface extends Phaser.Physics.Arcade.Sprite {
  opened: boolean
  hiddenCharName: import('../src/scripts/utils/constants').ANIMAL_SKINS | null
  objectPosition: ObjectPosition

  isRightTarget: (skin: import('../src/scripts/utils/constants').ANIMAL_SKINS | null) => boolean
  wrongTarget: () => void
  close: () => void
  reset: () => void
  openTarget: (withSound: boolean) => void
  setHiddenCharName: (name: import('../src/scripts/utils/constants').ANIMAL_SKINS | null) => void
  isSelected: () => void
  toggleHelp: (enable: boolean) => void
}
