import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import { createLabel } from './textUtil'

export class ModalDialog{
  dialog: Dialog

  constructor(private scene: Phaser.Scene) {}

  create(config: ModalDialogConfig) {
    if (this.dialog) {
      this.dialog.destroy()
    }
    const { width, height, content, labels } = config

    this.dialog = new Dialog(this.scene, {
      x: width * 0.5,
      y: height * 0.5,
      width: width * 0.5,
      height: height * 0.5,
      background: this.scene.add.image(0, 0, 'modalbg').setOrigin(0.5),
      content: this.scene.add.bitmapText(0, 0, 'shortStack', content, 82),
      actions: labels.map(labelConfig => createLabel(this.scene, labelConfig)),
      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
      align: {
        actions: 'center', // 'center'|'left'|'right'
      },
      expand: {
        content: false, // Content is a pure text object
      },
    })
  }

  show(onClickCallback: (groupName: string, index: number) => void) {
    this.dialog
    .layout()
    .popUp(1000)
    .on(
      'button.click',
      (button, groupName, index, pointer, event) => {
        if(onClickCallback) {
            onClickCallback(groupName, index)
        }
      },
      this
    )
    .on('button.over', (button, groupName, index, pointer, event) => {
      button.getElement('background').setStrokeStyle(1, 0xffffff)
    })
    .on('button.out', (button, groupName, index, pointer, event) => {
      button.getElement('background').setStrokeStyle()
    })
  }
}
