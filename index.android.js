/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

class AwesomeProject extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          Dis sucks
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

import Camera from 'react-native-camera';

class BadInstagramCloneApp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }

  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

class HttpTestApp extends Component {
  constructor(props) {
    super(props);
    this.state = { nice: '' }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.pressed}>
          Sup son {this.state.nice}
        </Text>
      </View>
    )
  }

  pressed = () => {
    fetch("https://superseriouscompany.com/dias", {
      method: 'POST'
    }).then((response) => {
      debugger;
      this.setState({nice: response.json().good});
    }, (error) => {
      debugger;
    })
  }
}

AppRegistry.registerComponent('AwesomeProject', () => HttpTestApp);
