import React, { Component } from 'react';

import {
  Alert,
  Platform,
  Text,
  TouchableHighlight,
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
          <TouchableHighlight onPress={this.enqueue.bind(this)} accessible={true} accessibilityLabel={'Choose later'}>
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
