import React, { Component } from 'react';

import {
  Platform,
} from 'react-native';

import { InAppUtils } from 'NativeModules';

import IOSSubmissionScene from './submissionScene.ios';
import AndroidSubmissionScene from './submissionScene.android';

class SubmissionScene extends Component {
  render() {
    <View>
      {
        Platform.OS === 'android' ?
          <AndroidSubmissionScene />
        :
          <IOSSubmissionScene />
      }
    </View>
  }
}

module.exports = SubmissionScene;
