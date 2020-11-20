declare interface ObjectPosition extends TilePosition {
  x: number
  y: number
}

declare interface TilePosition {
  row: number
  col: number
  tile?: import('../src/scripts/utils/constants').TILES
}

declare interface NextLevel {
  gameWorld: GameWorld
  level: number
}

declare interface ButtonConfig {
  text?: {
    title?: string
    fontSize?: string
    stroke?: {
      color: string
      thickness: number
    }
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
  backgroudSound: boolean
  tutorials: Array<TutorialFileStorageConfig>
  levels: Array<LevelFileStorageConfig>
  gems: number
  skillItems: Array<SkillItemFileStorageConfig>
}

declare interface SkillItemFileStorageConfig {
  quantity: number
  skin: import('../src/scripts/utils/skillItems').SKILL_ITEM_SKINS
}

declare interface SkillItemInScene {
  skillItem: import('../src/scripts/objects/skillItems/skillItem').default
  quantity: number
}
declare interface LevelFileStorageConfig {
  key: string
  level: number
  stars: number
  attempts?: number
}

declare interface TutorialFileStorageConfig {
  key: string
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
  angle?: number
}

declare interface Level {
  level: number
  rounds: number
  hiddens: number
  tutorial?: { text: Array<string>; showPointer?: TilePosition }
  tileOverride?: Array<{ position: TilePosition; tileName: string }>
  extraHiddens?: number
}

declare interface PauseSceneConfig {
  onHome: () => void
  onResume: () => void
  onRestart: () => void
}

declare interface MainSceneConfig extends CurrentWorldAndLevelConfig {
  skillItems: Array<SkillItemFileStorageConfig>
}

declare interface CurrentWorldAndLevelConfig {
  gameWorld: GameWorld
  level: Level
}

declare interface PlayerConstructor {
  new (
    scene: Phaser.Scene,
    objectPosition: ObjectPosition,
    gameMap: import('../src/scripts/controllers/gameMap').GameMap
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
  stuck: boolean
  hiddenChar?: import('../src/scripts/objects/hiddenChar').default
  objectPosition: ObjectPosition
  id: number

  isRightTarget: (skin: import('../src/scripts/utils/constants').ANIMAL_SKINS | null) => boolean
  wrongTarget: () => void
  close: () => void
  reset: () => void
  openTarget: (withSound: boolean) => void
  setHiddenChar: (hiddenChar: import('../src/scripts/objects/hiddenChar').default) => void
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

declare interface SkillItemConstructor {
  new (
    scene: Phaser.Scene
  ): import('../src/scripts/objects/skillItems/skillItem').default
}

declare interface SkillItemListInterface {
  clazz: SkillItemConstructor
  skin: import('../src/scripts/utils/skillItems').SKILL_ITEM_SKINS
}

declare interface SkillItemDefinition {
  skin: import('../src/scripts/utils/skillItems').SKILL_ITEM_SKINS
  type: import('../src/scripts/utils/skillItems').SKILL_ITEM_TYPE
  state: import('../src/scripts/utils/constants').MAIN_SCENE_STATE
  maxPerLevel: number
  itemCost: number
  title: string
  description: Array<string>
}

declare interface FrameBigInterface {
  title: string
  visible: boolean
  subTitle?: string
  onCloseButton?: () => Promise<void>
}

declare interface SkillItemBuyFrameInterface extends FrameBigInterface {
  gems: number
  onConfirmButton: (skillItem: SkillItemDefinition) => Promise<void>
}
