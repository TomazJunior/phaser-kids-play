declare interface ModalDialogConfig {
  content: ModalDialogContentConfig,
  subContent?: ModalDialogContentConfig,
  buttonConfigs: ButtonConfig[],
  onClose?: () => void
}

declare interface ModalDialogContentConfig {
  text: string
  fontSize: string,
  color: string,
  x: number,
  y: number
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
