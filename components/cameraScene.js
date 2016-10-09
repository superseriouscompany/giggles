import React, { Component } from 'react';
var RNUploader = require('NativeModules').RNUploader;
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'
import Camera from 'react-native-camera'

class CameraScene extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false
    };
  }

  takePicture = () => {
    if( !this.camera ) return;
    this.camera.capture().then((data) => {
      let body = new FormData();
      let photo = {
        path: data.path,
        type: 'image/jpeg',
        name: 'photo.jpg'
      }
      body.append('photo', photo);

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        console.log(xhr.status, xhr.responseText);
      }

      xhr.open('POST', 'https://bf9083e7.ngrok.io/foo');
      xhr.send(body);
    }).catch(err => console.error(err));
  }


  render = () => {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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

module.exports = CameraScene;
