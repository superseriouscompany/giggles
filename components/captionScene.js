import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Dimensions,
  Alert
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';

class Caption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0.0,
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
      this.setState({currentTime: Math.floor(data.currentTime)});
    };
    AudioRecorder.onFinished = (data) => {
      this.setState({finished: data.finished});
      console.log(`Finished recording: ${data.finished}`);
    };
  }

  _renderButton(title, onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableHighlight>
    );
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
    body.append('audio', {uri: 'file://'+path, name: 'test.aac'});

    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = (e) => {
      if( xhr.readyState !== 4 ) { return; }

      console.log(xhr.status, xhr.responseText);
    }
    xhr.open('POST', 'https://bf9083e7.ngrok.io/captions');
    xhr.send(body);
  }

  _cancel() {
    this.setState({stoppedRecording: false, recording: false});
  }

  render() {
    const imageWidth = 420, imageHeight = 420;

    return (
      <View style={[styles.container, styles.blackBg]}>
        { this.state.recording ? // if recording, show progress
          <View>
            <View style={{width: Dimensions.get('window').width * (this.state.progress / 100), height: 1, backgroundColor: 'red'}}></View>
            <Text style={{color: 'white'}}>{this.state.currentTime}s</Text>
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

        <View style={{height: Dimensions.get('window').width * (imageHeight / imageWidth)}}>
          <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        </View>

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
              <Image source={require('../images/Record.png')}/>
            </TouchableHighlight>
          </View>
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 30,
  },
  blackBg: {
    backgroundColor: 'black'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20
  },
  bottomMiddle: {
    alignItems: 'center',
  },
  bottomTwoButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

module.exports = Caption;
