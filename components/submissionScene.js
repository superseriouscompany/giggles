import React, { Component } from 'react';

import {
  Alert,
  Platform,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { InAppUtils } from 'NativeModules';

import SubmissionButton from './submissionButton';

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20}}>
        <SubmissionButton />
        <View>
          <TouchableHighlight onPress={this.enqueue.bind(this)}>
            <Text>Nope</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  enqueue() {
    Alert.alert('Added you to the queue', 'But you have no chance');
    this.navigator.navigate('CaptionScene');
  }
}

module.exports = SubmissionScene;
