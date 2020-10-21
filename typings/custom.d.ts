
declare interface ObjectPosition extends TilePosition{
  x: number; y: number
}

declare interface TilePosition {
  row: number, col: number
}

declare interface ButtonConfig {
  text?: string
  name?: import('../src/scripts/utils/constants').BUTTON
  scale?: {
    x: number
    y: number
  }
  onClick: () => void
}

declare interface FileStorageConfig {
    tutorialMode: boolean
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
  from: number
  to: number
  hiddens: number
}
