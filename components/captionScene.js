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

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
var windowSize = Dimensions.get('window');

const imageWidth = 200, imageHeight = 100;
const windowRatio = windowSize.width / windowSize.height;
const imageRatio = imageWidth / imageHeight;

let newImageWidth, newImageHeight;
if( imageRatio >= windowRatio ) {
  // wide image
  newImageWidth = windowSize.width;
  newImageHeight = newImageWidth / (imageWidth / imageHeight);
} else {
  // tall image
  newImageHeight = windowSize.height;
  newImageWidth = (imageWidth / imageHeight) * newImageHeight;
}

class Caption extends Component {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;

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

  tapRemixesList = () => {
    this.navigator.navigate('captions');
  }

  render() {
    return (
      <View style={styles.imageBackground}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>
        <Image style={styles.mainImage} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}}></Image>

        <View style={styles.container}>
          { this.state.recording ? // if recording, show progress
            <View>
              <View style={{width: windowSize.width * (this.state.progress / 100), height: 3, backgroundColor: '#D0021B'}}></View>
              <View style={styles.topRow}>
                <Image source={require('../images/Recording.png')}/>
              </View>
              <View style={styles.bottomMiddle}>
                <TouchableHighlight onPress={this.tapStopMicrophone}>
                  <Image source={require('../images/StopRecord.png')}/>
                </TouchableHighlight>
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
                <Image source={require('../images/Record.png')}/>
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
  mainImage: {
    width: newImageWidth,
    height: newImageHeight,
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
