declare interface ObjectPosition extends TilePosition {
  x: number
  y: number
}

declare interface TilePosition {
  row: number
  col: number
  tile?: import('../src/scripts/utils/constants').TILES
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
  key: string
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
  key: string
  name: string
  map: any[][]
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
  textures?: Array<{ texture: string; frame?: string }>
  tile: import('../src/scripts/utils/constants').TILES
  tileType: import('../src/scripts/utils/constants').TileGameWorldType
  rotation?: number
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
  new (
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    gameMap: import('../src/scripts/objects/map').GameMap
  ): PlayerInterface
}
declare interface PlayerInterface extends Phaser.Physics.Arcade.Sprite {
  objectPosition: ObjectPosition
  setIsGoingTo: (pathToGo: Array<ObjectPosition>, initialPos) => void
  goTo: (target: TargetInterface, pathToGo: Array<ObjectPosition>) => void
  goToPath: (targetObjectPosition: ObjectPosition, pathToGo: Array<ObjectPosition>) => void
  pushHiddenChar: (
    hiddenChar: import('../src/scripts/objects/hiddenChar').default,
    target: TargetInterface | undefined,
    onComplete: () => Promise<void>
  ) => void
  isReady: boolean
}

declare interface TargetConstructor {
  new (
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    container: Phaser.Physics.Arcade.StaticGroup,
    tileConfigGameWorld: TileConfigGameWorld,
    tileGameWorld: TileGameWorld | undefined,
    id: number
  ): TargetInterface
}

declare interface TargetInterface extends Phaser.Physics.Arcade.Sprite {
  opened: boolean
  hiddenCharName: import('../src/scripts/utils/constants').ANIMAL_SKINS | null
  objectPosition: ObjectPosition
  id: number

  isRightTarget: (skin: import('../src/scripts/utils/constants').ANIMAL_SKINS | null) => boolean
  wrongTarget: () => void
  close: () => void
  reset: () => void
  openTarget: (withSound: boolean) => void
  setHiddenCharName: (name: import('../src/scripts/utils/constants').ANIMAL_SKINS | null) => void
  isSelected: () => void
  toggleHelp: (enable: boolean) => void
  hideQueuePosition: () => void
  showQueuePosition: (position: number) => void
}

declare interface Neighbors {
  top?: { x: number; y: number }
  right?: { x: number; y: number }
  bottom?: { x: number; y: number }
  left?: { x: number; y: number }
}
