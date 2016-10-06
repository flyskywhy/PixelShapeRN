import './apptoolbox.styl';

import React, { Component } from 'react';
import AppToolButton from 'components/apptoolbutton/Apptoolbutton';
import ModalWindow from 'components/modalwindow/Modalwindow';
import ToggleCheckbox from 'components/togglecheckbox/Togglecheckbox';

import FileSaver from 'file-saver';

class Apptoolbox extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      newProjectShow: false,
      downloadProjectShow: false,
      customizeSettingsShow: false
    }
  }

  downloadGIF() {
    const byteChars = this.props.gifFramesArray.join(''),
          len = byteChars.length,
          bytes = new Array(len);

    let i = 0, blob = null;

    for (; i < len; i++) {
        bytes[i] = byteChars.charCodeAt(i);
    }

    blob = new Blob([new Uint8Array(bytes)], {type: 'image/gif'});
    FileSaver.saveAs(blob, 'myGif.gif');
  }

  // RESET PROJECT callbacks start
  resetProject() {
    this.setState({
      newProjectShow: true,
      downloadProjectShow: false,
      customizeSettingsShow: false
    });
  }

  resetProjectConfirm() {
    this.props.resetFramesState();
    this.props.addFrame();
    this.setState({ newProjectShow: false });
  }

  resetProjectCancel() {
    this.setState({ newProjectShow: false });
  }
  // RESET PROJECT callbacks end

  // SAVE PROJECT callbacks start
  downloadProject() {
    this.setState({
      newProjectShow: false,
      downloadProjectShow: true,
      customizeSettingsShow: false
    });
  }

  downloadProjectConfirm() {
    this.downloadGIF();
    this.setState({ downloadProjectShow: false });
  }

  downloadProjectCancel() {
    this.setState({ downloadProjectShow: false });
  }
  // SAVE PROJECT callbacks end

  // CUSTOMIZE SETTINGS callbacks start
  customizeSettings() {
    this.setState({
      newProjectShow: false,
      downloadProjectShow: false,
      customizeSettingsShow: true
    })
  }

  customizeSettingsConfirm() {
    this.setState({ customizeSettingsShow: false });
  }

  customizeSettingsCancel() {
    this.setState({ customizeSettingsShow: false })
  }
  // CUSTOMIZE SETTINGS callbacks end

  render() {
    return (
      <aside className="apptoolbox">
        <ul className="apptoolbox__buttons">
          <AppToolButton
            btnTooltip="New project"
            width="30" height="30" icon="new-project"
            doAction={this.resetProject.bind(this)} />
          <AppToolButton
            btnTooltip="Undo"
            width="30" height="30" icon="undo"
            doAction={() => {}} />
          <AppToolButton
            btnTooltip="Redo"
            width="30" height="30" icon="redo"
            doAction={() => {}} />
          <AppToolButton
            btnTooltip="Download"
            width="30" height="30" icon="download"
            doAction={this.downloadProject.bind(this)} />
          <AppToolButton
            btnTooltip="Settings"
            width="30" height="30" icon="settings"
            doAction={this.customizeSettings.bind(this)} />
        </ul>

        <div className="modalContainer"></div>
        <ModalWindow
          title="New project"
          ok={{ text: 'Create', action: this.resetProjectConfirm.bind(this) }}
          cancel={{ text: 'Cancel', action: this.resetProjectCancel.bind(this) }}
          isShown={this.state.newProjectShow}>

          <ToggleCheckbox>Reset palette</ToggleCheckbox>
        </ModalWindow>

        <ModalWindow
          title="Download project"
          ok={{ text: 'Download', action: this.downloadProjectConfirm.bind(this) }}
          cancel={{ text: 'Cancel', action: this.downloadProjectCancel.bind(this) }}
          isShown={this.state.downloadProjectShow}>

          <ToggleCheckbox>Include spritesheet</ToggleCheckbox>
          <ToggleCheckbox>Include custom palette</ToggleCheckbox>

        </ModalWindow>

        <ModalWindow
          title="Settings"
          ok={{ text: 'Save', action: this.customizeSettingsConfirm.bind(this) }}
          cancel={{ text: 'Cancel', action: this.customizeSettingsCancel.bind(this) }}
          isShown={this.state.customizeSettingsShow}>

          <div className="apptoolbox__dimensions">
            <div>
              <span className="apptoolbox__inputlabel">Width </span>
              <input className="apptoolbox__inputinline" defaultValue="700" />
            </div>
            <div>
              <span className="apptoolbox__inputlabel">Height </span>
              <input className="apptoolbox__inputinline" defaultValue="700" />
            </div>
          </div>
          <ToggleCheckbox>Show grid</ToggleCheckbox>

        </ModalWindow>
      </aside>
    )
  }
}

export default Apptoolbox;