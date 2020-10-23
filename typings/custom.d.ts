
declare interface ObjectPosition extends TilePosition{
  x: number; y: number
}

declare interface TilePosition {
  row: number, col: number
}

declare interface ButtonConfig {
  text?: {
    title?: string,
    fontSize?: string,
    padding?: {
      x?: number,
      y?: number
    }
  },
  name?: import('../src/scripts/utils/constants').BUTTON
  prefix?:import('../src/scripts/utils/constants').BUTTON_PREFIX
  scale?: {
    x: number
    y: number
  },
  visible?: boolean
  onClick: () => void
}

declare interface FileStorageConfig {
    tutorialMode: boolean,
    levels: Array<LevelFileStorageConfig>
}

declare interface LevelFileStorageConfig {
  level: number,
  stars: number
}

declare interface Window {
  appConfig: any
  device: any
  StatusBar: any
  cordova: any
  plugins: any
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