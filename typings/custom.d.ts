declare interface ModalDialogConfig
{
    content: string,
    width: number,
    height: number,
    labels: ModalDialogLabelConfig[]
}

declare interface ModalDialogLabelConfig {
    content: string,
    icon: string
}

declare interface ButtonConfig {
    text?: string,
    icon: string,
    iconFrame?: string,
    onClick: () => void
}
