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
