import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';

class AudioExample extends Component {
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

  _pause() {
    if (this.state.recording){
      AudioRecorder.pauseRecording();
      this.setState({stoppedRecording: true, recording: false});
    }
    else if (this.state.playing) {
      AudioRecorder.pausePlaying();
      this.setState({playing: false, stoppedPlaying: true});
    }
  }

  _stop() {
    if (this.state.recording) {
      AudioRecorder.stopRecording();
      this.setState({stoppedRecording: true, recording: false});
    } else if (this.state.playing) {
      AudioRecorder.stopPlaying();
      this.setState({playing: false, stoppedPlaying: true});
    }
  }

  _record() {
    console.log("dopiness");
    if( this.state.recording ) {
      return this._stop();
    }
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
            <TouchableHighlight onPress={this.cancel}>
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
            <TouchableHighlight onPress={this.replay}>
              <Image source={require('../images/Play.png')}/>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.submit}>
              <Image source={require('../images/Submit.png')}/>
            </TouchableHighlight>
          </View>
        :
          <View style={styles.bottomMiddle}>
            <TouchableHighlight onPress={this._record.bind(this)}>
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

module.exports = AudioExample;
