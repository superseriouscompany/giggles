import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native'

class Source extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
  }

  render = () => {
    return (
      <View style={[styles.container, styles.blackBg]}>
        <Text style={[styles.topLeft, styles.white]}>Meme</Text>
        <Text style={[styles.topRight, styles.white]}>Camera</Text>
        <View style={styles.bottomMiddle}>
          <Text style={styles.white} onPress={this.tapMicrophone}>Microphone</Text>
        </View>
      </View>
    )
  }

  tapMicrophone = () => {
    Alert.alert(
      'Title',
      'Msg',
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
  white: {
    color: 'white'
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
