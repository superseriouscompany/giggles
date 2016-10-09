import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Alert,
  StatusBar,
  Platform
} from 'react-native'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
var windowSize = Dimensions.get('window');

const imageWidth = 200, imageHeight = 100;
var windowRatio = windowSize.width / windowSize.height;
var imageRatio = imageWidth / imageHeight;

var newImageWidth, newImageHeight;
if( imageRatio >= windowRatio ) {
  // wide image
  newImageWidth = windowSize.width;
  newImageHeight = newImageWidth / (imageWidth / imageHeight);
} else {
  // tall image
  newImageHeight = windowSize.height;
  newImageWidth = (imageWidth / imageHeight) * newImageHeight;
}

class Source extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {
      progress: 0
    };
  }

  render = () => {
    return (
      <View style={styles.imageBackground}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>

        <Image style={styles.mainImage} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}}></Image>

        <View style={styles.container}>
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
            <View style={{width: windowSize.width * (this.state.progress / 100), height: 1, backgroundColor: 'red'}}></View>
          }

          { !this.state.isDone ?
            <View style={styles.bottomMiddle}>
              <TouchableHighlight onPress={this.tapMicrophone}>
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
      </View>
    )
  }

  tapMicrophone = () => {
    this.setState({
      isRecording: true
    })

    let progress = 0;
    setTimeout(cool.bind(this), 10);
    function cool() {
      this.setState({
        progress: ++progress
      });

      if( progress > 100 ) {
        return this.setState({
          isDone: true
        })
      }

      return setTimeout(cool.bind(this), 10);
    }
  }

  cancel = () => {
    this.setState({
      isRecording: false,
      isDone: false
    })
  }

  tapOriginalsList = () => {
    Alert.alert(
      'Check out all the originals',
      "jk you can't",
      [
        { text: 'OK', onPress: () => console.log('Cool')}
      ]
    )
  }

  tapRemixesList = () => {
    Alert.alert(
      'Check out all the remixes',
      "jk you can't",
      [
        { text: 'OK', onPress: () => console.log('Cool')}
      ]
    )
  }
}

const styles = StyleSheet.create({
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
  blackBg: {
    backgroundColor: 'black'
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
})

module.exports = Source;
