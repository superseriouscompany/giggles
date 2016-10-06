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
    this.state = {
      isDone: true,
      isRecording: true
    };
  }

  render = () => {
    const imageWidth = 200, imageHeight = 200;

    return (
      <View style={[styles.container, styles.blackBg]}>
        {
          this.state.isRecording ?
            this.state.isDone ?
              <TouchableHighlight onPress={this.cancel}>
                <Image source={require('../images/Cancel.png')}/>
              </TouchableHighlight>
            :
              <Text style={styles.debug}>Recording</Text>
          :
            <View style={styles.topRow}>
              <TouchableHighlight onPress={this.tapOriginalsList}>
                <Image source={require('../images/SeeAllOriginals.png')}/>
              </TouchableHighlight>

              <TouchableHighlight onPress={this.tapRemixesList}>
                <Image source={require('../images/SeeRemixes.png')}/>
              </TouchableHighlight>
            </View>
        }


        <View style={[{height: imageHeight}, styles.mainImage]}>
          <Image style={{width: imageWidth, height: imageHeight}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        </View>

        {
          !this.state.isDone ?
            <View style={styles.bottomMiddle}>
              <TouchableHighlight onPress={this.tapMicrophone}>
                <Image source={require('../images/Record.png')}/>
              </TouchableHighlight>
            </View>
          :
            <View style={styles.bottomMiddle}>
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

  tapMicrophone = () => {
    this.setState({
      isRecording: true
    })

    setTimeout(cool.bind(this), 1000);
    function cool() {
      this.setState({
        isDone: true
      })
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
