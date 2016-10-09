import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native'

import {AudioRecorder, AudioUtils} from 'react-native-audio';


class CaptionCreate extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {
      progress: 0,
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      stoppedPlaying: false,
      playing: false,
      finished: false
    };
  }

  render = () => {
    const imageWidth = 420, imageHeight = 420;

    return (

      <View style={[styles.container, styles.blackBg]}>
        <View>
          <Text style={{color: 'white'}}>Halp {this.currentTime}</Text>
        </View>
        { !this.state.isRecording ? // if not recording, show regular top menubar
          <View style={styles.topRow}>
            <TouchableHighlight onPress={this.tapOriginalsList}>
              <Image source={require('../images/SeeAllOriginals.png')}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.tapRemixesList}>
              <Image source={require('../images/SeeRemixes.png')}/>
            </TouchableHighlight>
          </View>
        : this.state.isDone ? // if recording and done, show cancel button
          <View style={styles.topRow}>
            <TouchableHighlight onPress={this.cancel}>
            <Image source={require('../images/Cancel.png')}/>
            </TouchableHighlight>
          </View>
        : // if recording and not done, show progress bar
          <View style={{width: Dimensions.get('window').width * (this.state.progress / 100), height: 1, backgroundColor: 'red'}}></View>
        }

        <View style={{height: Dimensions.get('window').width * (imageHeight / imageWidth)}}>
          <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        </View>

        { !this.state.isDone ?
          <View style={styles.bottomMiddle}>
            <TouchableHighlight onPress={this.record}>
              <Image source={require('../images/Record.png')}/>
            </TouchableHighlight>
          </View>
        :
          <View style={styles.bottomTwoButton}>
            <TouchableHighlight onPress={this.replay}>
              <Image source={require('../images/Play.png')}/>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.submit}>
              <Image source={require('../images/Submit.png')}/>
            </TouchableHighlight>
          </View>
        }
      </View>
    )
  }

  prepareRecordingPath = (audioPath) => {
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
    console.log("caption scene mounted");
    // AudioRecorder.onProgress = (data) => {
    //   console.log("Got progress", data);
    //   this.setState({currentTime: Math.floor(data.currentTime)});
    // };
    // AudioRecorder.onFinished = (data) => {
    //   this.setState({finished: data.finished});
    //   console.log(`Finished recording: ${data.finished}`);
    // };
  }

  record = () => {
    AudioRecorder.startRecording();

    this.setState({
      isRecording: true
    })

    setTimeout(() => {
      AudioRecorder.stopRecording();
      console.log("hit timeout jam");
      this.setState({
        isDone: true
      })
    }, 2000);

  }

  replay = () => {
    AudioRecorder.playRecording();
  }

  cancel = () => {
    this.setState({
      isRecording: false,
      isDone: false
    })
  }

  tapOriginalsList = () => {
    this.navigator.navigate('meme');
  }

  tapRemixesList = () => {
    this.navigator.navigate('cool');
  }
}

const styles = StyleSheet.create({
  debug: {
    backgroundColor: 'pink'
  },
  container: {
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
    paddingTop: 30,
    paddingBottom: 30
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
  }
})

module.exports = CaptionCreate;
