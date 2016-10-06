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

class Source extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {};
  }

  render = () => {
    const imageWidth = 200, imageHeight = 200;

    return (
      <View style={[styles.container, styles.blackBg]}>
        <TouchableHighlight style={[styles.topLeft]} onPress={this.tapOriginalsList}>
          <Image source={require('../images/SeeAllOriginals.png')}/>
        </TouchableHighlight>

        <Image style={{width: imageWidth, height: imageHeight}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />

        <TouchableHighlight style={[styles.topRight]} onPress={this.tapRemixesList}>
          <Image source={require('../images/SeeRemixes.png')}/>
        </TouchableHighlight>

        <View style={styles.bottomMiddle}>
          <TouchableHighlight onPress={this.tapMicrophone}>
            <Image source={require('../images/Record.png')}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  tapMicrophone = () => {
    Alert.alert(
      'Start recording',
      "jk you can't",
      [
        { text: 'OK', onPress: () => console.log('Cool')}
      ]
    )
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
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    paddingTop: 30
  },
  blackBg: {
    backgroundColor: 'black'
  },
  topLeft: {
    position: 'absolute',
    top: 30,
    left: 20
  },
  topRight: {
    position: 'absolute',
    top: 30,
    right: 20
  },
  bottomMiddle: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

module.exports = Source;
