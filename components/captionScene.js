import React, {Component} from 'react';

import {
  Alert,
  AppRegistry,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';

import Api from '../lib/api';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const RECORDING_LENGTH = 30

const windowSize = Dimensions.get('window');

function imageDimensions(image) {
  const windowRatio = windowSize.width / windowSize.height;
  const imageRatio = image.width / image.height;

  if( imageRatio >= windowRatio ) {
    // wide image
    return {
      width: windowSize.width,
      height: windowSize.width / imageRatio,
    }
  } else {
    return {
      height: windowSize.height,
      width: imageRatio * windowSize.height,
    }
  }
}


class Caption extends Component {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;

    this.state = {
      percentComplete: 0,
      recording: false,
      stoppedRecording: false,
      stoppedPlaying: false,
      playing: false,
      finished: false
    };
  }

  prepareRecordingPath(audioPath){
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
    this.prepareRecordingPath(audioPath);
    AudioRecorder.onProgress = (data) => {
      let percentComplete = Math.min(1, data.currentTime / RECORDING_LENGTH);
      this.setState({percentComplete: percentComplete});
    };
    AudioRecorder.onFinished = (data) => {
      this.setState({finished: data.finished});
    };

    Api.submissions.current().then((submission) => {
      this.setState({
        submission: submission
      })
    }).catch(function(err) {
      console.error(err);
    })
  }

  _stop() {
    AudioRecorder.stopRecording();
    this.setState({stoppedRecording: true, recording: false});
  }

  _record() {
    if(this.state.stoppedRecording){
      let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
      this.prepareRecordingPath(audioPath);
    }
    AudioRecorder.startRecording();
    this.setState({recording: true, playing: false});
  }

  _play() {
    if (this.state.recording) {
      this._stop();
      this.setState({recording: false});
    }
    AudioRecorder.playRecording();
    this.setState({playing: true});
  }

  _submit() {
    const path = AudioUtils.DocumentDirectoryPath + '/test.aac'
    console.log(path);

    let body = new FormData();
    body.append('cool', 'nice');
    body.append('good', 'great');
    body.append('audio', {uri: 'file://'+path, name: 'test.aac', type: 'audio/aac'});

    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = (e) => {
      if( xhr.readyState !== 4 ) { return; }

      console.log(xhr.status, xhr.responseText);
      this.navigator.navigate('CaptionsScene');
    }
    xhr.open('POST', 'https://superserious.ngrok.io/captions');
    xhr.send(body);
  }

  _cancel() {
    this.setState({stoppedRecording: false, recording: false});
  }

  tapRemixesList = () => {
    this.navigator.navigate('CaptionsScene');
  }

  tapOriginalsList = () => {
    this.navigator.navigate('SubmissionsScene');
  }

  render() {
    return (
      <View style={styles.imageBackground}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>
        { this.state.submission ?
          <Image style={imageDimensions(this.state.submission)} source={{uri: this.state.submission.image_url}}></Image>
        :
          null
        }

        <View style={styles.container}>
          { this.state.recording ? // if recording, show progress
            <View>
              <View style={{width: windowSize.width * this.state.percentComplete, height: 3, backgroundColor: '#D0021B'}}></View>
              <View style={styles.topRow}>
                <Image source={require('../images/Recording.png')}/>
              </View>
            </View>
          : this.state.stoppedRecording ? // if recording and done, show cancel button
            <View style={styles.topRow}>
              <TouchableHighlight onPress={this._cancel.bind(this)}>
                <Image source={require('../images/Cancel.png')}/>
              </TouchableHighlight>
            </View>
          : // default: show top bar
            <View style={styles.topRow}>
              <TouchableHighlight onPress={this.tapOriginalsList}>
                <Image source={require('../images/SeeAllOriginals.png')}/>
              </TouchableHighlight>

              <TouchableHighlight onPress={this.tapRemixesList}>
                <Image source={require('../images/SeeRemixes.png')}/>
              </TouchableHighlight>
            </View>
          }

          { this.state.stoppedRecording ?
            <View style={styles.bottomTwoButton}>
              <TouchableHighlight onPress={this._play.bind(this)}>
                <Image source={require('../images/Play.png')}/>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._submit.bind(this)}>
                <Image source={require('../images/Submit.png')}/>
              </TouchableHighlight>
            </View>
          :
            <View style={styles.bottomMiddle}>
              <TouchableHighlight onPressIn={this._record.bind(this)} onPressOut={this._stop.bind(this)}>
                { this.state.recording ?
                  <Image source={require('../images/StopRecord.png')} />
                :
                  <Image source={require('../images/Record.png')}/>
                }
              </TouchableHighlight>
            </View>
          }
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  debug: {
    backgroundColor: 'pink'
  },
  imageBackground: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: STATUSBAR_HEIGHT,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    width: windowSize.width,
    height: windowSize.height,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomMiddle: {
    alignItems: 'center',
  },
  bottomTwoButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = Caption;
