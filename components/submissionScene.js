import React, { Component } from 'react';

import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SubmissionButton from './submissionButton';

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20}}>
        <SubmissionButton navigator={this.navigator} submissionId={this.props.submissionId}/>
        <View>
          <TouchableOpacity onPress={this.enqueue.bind(this)} accessible={true} accessibilityLabel={'Choose later'}>
            <Text>Nope</Text>
          </TouchableOpacity>
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
