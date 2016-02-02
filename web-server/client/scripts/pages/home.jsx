import React from "react";
import ReactAddons from "react/addons"
import _ from "lodash";
import Component from "../components/baseComponent.jsx";
import connectToStores from "alt/utils/connectToStores";
import FileInput from "../components/fileInput.jsx";
import Spinner from "../components/spinner.jsx";
import ImageCard from "../components/imageCard.jsx";
import AudioCapture from "../components/audioCapture.jsx";
import AudioStore from "../stores/audioStore.js";
import AudioActions from "../actions/audioActions.js";


class Home extends Component {

  static getStores() {
    return [AudioStore];
  }

  static getPropsFromStores() {
    return AudioStore.getState();
  }

  handleSubmitVideo(evt) {

    evt.preventDefault();

    const file = this.refs.fileInput.getFiles()[0];
    if (file) {
      AudioActions.uploadAudio(file)
    }
  }

  handleClickExample(videoID, evt) {

    evt.preventDefault();
    AudioActions.useExample(videoID);

  }

  getSpinner() {

    if (this.props.isUploading) {
      return <Spinner size="small"/>;
    } else {
      return <span/>
    }
  }

  getExampleAudio() {

    const exampleAudio = AudioStore.getExampleAudio();
    return exampleAudio.map((audio) => {
      const actions = [
        <a href="#" key={_.uniqueId()} onClick={this.handleClickExample.bind(this, audio.id)}>Get Prediction</a>
      ];

      return (
        <div className="col s12 m4" key={audio.title}>
          <div className="card-link" onClick={this.handleClickExample.bind(this, audio.id)}>
            <ImageCard
              image={audio.thumbnail}
              title={audio.title}
              content={audio.language}
              actions={actions}
            />
          </div>
        </div>
      )
    });
  }

  getErrorPanel() {

    if (this.props.isInvalidFile)
      return (
         <div className="row">
          <div className="col s12">
            <div className="card-panel red">
              <p className="white-text">
                <i className="material-icons">error</i>
                 You uploaded an invalid file. Only Audio files are allowed. (wav, mp3)
              </p>
            </div>
          </div>
        </div>
      );
  }

  render() {

    const spinner =  this.getSpinner();
    const exampleAudio = this.getExampleAudio();
    const errorPanel = this.getErrorPanel();
    const CSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup;


    return (
      <div className="home-page">
        {errorPanel}

        <div className="row">
          <div className="col s12">
            <div className="card-panel">

              <div className="card-title">Capture some audio with your Microphone</div>
              <AudioCapture/>

            </div>
          </div>
        </div>
        <div className="row">
          {exampleAudio}
        </div>
      </div>
    );
  }
}

export default connectToStores(Home);
