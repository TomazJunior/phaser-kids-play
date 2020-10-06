
declare interface ModalDialogConfig
{
    content: string,
    buttonConfigs: ButtonConfig[];
}

declare interface ButtonConfig {
    text?: string,
    icon: string,
    iconFrame?: string,
    parentWidth?: number,
    onClick: () => void
}
