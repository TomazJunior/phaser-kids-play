declare interface ModalDialogConfig {
  content: {
    text: string
    fontSize: string,
    x: number,
    y: number
  }
  buttonConfigs: ButtonConfig[],
  onClose?: () => void
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
