declare interface ObjectPosition extends TilePosition{
  x: number; y: number
}

declare interface TilePosition {
  row: number, col: number
}

declare interface ButtonConfig {
  text?: string
  icon: string
  iconFrame?: string
  parentWidth?: number
  paddingX?: number
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
