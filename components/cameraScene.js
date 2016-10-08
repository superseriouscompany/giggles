import React, { Component } from 'react';
import {
  View,
  Text
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
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }


  render = () => {
    return (
      <View>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          aspect={Camera.constants.Aspect.fill}>
          <Text onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }

  takePicture = () => {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

module.exports = CameraScene;
