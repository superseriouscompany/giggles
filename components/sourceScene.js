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
        <View style={styles.topRow}>
          <TouchableHighlight style={[styles.topLeft]} onPress={this.tapOriginalsList}>
            <Image source={require('../images/SeeAllOriginals.png')}/>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.topRight]} onPress={this.tapRemixesList}>
            <Image source={require('../images/SeeRemixes.png')}/>
          </TouchableHighlight>
        </View>

        <View style={[{height: imageHeight}, styles.mainImage]}>
          <Image style={{width: imageWidth, height: imageHeight}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        </View>


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
  mainImage: {
    alignItems: 'center'
  },
  bottomMiddle: {
    alignItems: 'center',
  }
})

module.exports = Source;
