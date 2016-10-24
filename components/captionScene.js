'use strict';

import React, {Component} from 'react';

import {
  ActivityIndicator,
  Alert,
  AppRegistry,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Api from '../lib/api';
import CacheableImage from 'react-native-cacheable-image';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 5 : 0;
const RECORDING_LENGTH = 30;
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

let isMounted;

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
      finished: false,
      loadingSubmission: true,
    };
  }

  componentDidMount() {
    isMounted = true;
    AudioRecorder.onProgress = (data) => {
      let percentComplete = data.currentTime / RECORDING_LENGTH;
      if( percentComplete >= 1 ) {
        return this._stop();
      }
      return this.setState({percentComplete: percentComplete});
    };
    AudioRecorder.onFinished = (data) => {
      this.setState({finished: data.finished});
    };

    Api.submissions.current().then((submission) => {
      if( isMounted ) {
        this.setState({
          submission: submission,
          loadingSubmission: false,
        })
      }
    }).catch(function(err) {
      console.error(err);
    })
  }

  componentWillUnmount() {
    this._stop();
    AudioRecorder.stopPlaying();
    isMounted = false;
    AudioRecorder.onProgress = null;
    AudioRecorder.onFinished = null;
  }

  _stop() {
    if( !this.state.recording ) { return; }
    AudioRecorder.stopRecording();
    this.setState({stoppedRecording: true, recording: false});
  }

  _toggleRecord() {
    if( this.state.recording ) {
      return this._stop();
    }

    AudioRecorder.checkAuthorizationStatus().then((status) => {
      this.setState({audioPermissions: status});
      if( status === 'denied' ) {
        return Alert.alert("Oops! You denied microphone permissions", "To fix this, go into your iPhone Settings > Giggles > Microphone ");
      } else if( status === 'undetermined') {
        return AudioRecorder.requestAuthorization();
      }

      let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
      AudioRecorder.startRecording();
      this.setState({recording: true, playing: false});
    })
  }

  _play() {
    if (this.state.recording) {
      this._stop();
      this.setState({recording: false});
    }
    AudioRecorder.stopPlaying();
    AudioRecorder.playRecording();
    this.setState({playing: true});
  }

  _submit(submissionId) {
    const path = AudioUtils.DocumentDirectoryPath + '/test.aac'

    let body = new FormData();
    body.append('audio', {uri: 'file://'+path, name: 'test.aac', type: 'audio/aac'});

    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = (e) => {
      if( xhr.readyState !== 4 ) { return; }

      if( isMounted ) {
        this.navigator.navigate('CaptionsScene');
      }
    }
    xhr.open('POST', `https://giggles.superserious.co/submissions/${submissionId}/captions`);
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
        <StatusBar hidden={true}/>
        { this.state.submission ?
          <CacheableImage
            source={{uri: this.state.submission.image_url}}
            style={imageDimensions(this.state.submission)}
            onLoadStart={() => isMounted && this.setState({loadingImage: true})}
            onLoadEnd={() => isMounted && this.setState({loadingImage: false})}
            />
        : this.state.loadingSubmission ?
          <ActivityIndicator
            style={[styles.centering, {transform: [{scale: 1.5}]}]}
            size="small"
            color="ghostwhite"
          />
        :
          <Text style={{color: 'papayawhip'}}>Loaded no submissions.</Text>
        }

        { this.state.loadingImage ?
          <ActivityIndicator
            style={[styles.centering, {transform: [{scale: 1.5}]}]}
            size="small"
            color="ghostwhite"
          />
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
              <TouchableOpacity onPress={this._cancel.bind(this)}>
                <Image source={require('../images/GoScreenLeft.png')}/>
              </TouchableOpacity>
            </View>
          : // default: show top bar
            <View style={styles.topRow}>
              <TouchableOpacity onPress={this.tapOriginalsList} accessible={true} accessibilityLabel={'See photos'}>
                <Image source={require('../images/SeeAllOriginals.png')}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.tapRemixesList}>
                <Image source={require('../images/SeeRemixes.png')}/>
              </TouchableOpacity>
            </View>
          }

          { this.state.stoppedRecording ?
            <View style={styles.bottomTwoButton}>
              <TouchableOpacity onPress={this._play.bind(this)}>
                <Image source={require('../images/Play.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._submit(this.state.submission.id)}>
                <Image source={require('../images/Submit.png')}/>
              </TouchableOpacity>
            </View>
          :
            <View style={styles.bottomMiddle}>
              <TouchableOpacity onPress={this._toggleRecord.bind(this)}>
                { this.state.recording ?
                  <Image source={require('../images/StopRecord.png')} />
                :
                  <Image source={require('../images/Record.png')}/>
                }
              </TouchableOpacity>
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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  imageBackground: {
    backgroundColor: '#181818',
    flex: 1,
    flexDirection: 'column',
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
