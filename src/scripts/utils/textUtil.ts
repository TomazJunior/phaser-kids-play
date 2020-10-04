import { Buttons, Label, RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js'

export const createLabel = (scene: Phaser.Scene, labelConfig: ModalDialogLabelConfig) => {
    return new Label(scene, {
      background: scene.add.existing(new RoundRectangle(scene, 0, 0, 0, 0, 20, 0x5e92f3)),
      align: 'center',
      text: scene.add.text(0, 0, labelConfig.content, {
        fontFamily: 'AlloyInk',
        fontSize: '46px',
      }),
      icon: labelConfig.icon ? scene.add.image(0,0, labelConfig.icon) : undefined,
      space: {
        icon: 20,
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    })
  }
