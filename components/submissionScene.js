import React, { Component } from 'react';

import {
  Alert,
  Platform,
  StyleSheet,
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
      <View style={styles.background}>
        <Text style={styles.headerText}>
          Success!{"\n"}{"\n"}
          When should we show your{"\n"}
          photo?
        </Text>
      </View>
    )
  }

  enqueue() {
    Alert.alert('Added you to the queue', 'But you have no chance');
    this.navigator.navigate('CaptionScene');
  }
}

const styles = StyleSheet.create({
  debug: {
    backgroundColor: 'pink',
  },
  background: {
    flex: 1,
    backgroundColor: '#181818',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 50,
    fontFamily: 'NotoSans',
  }
});

module.exports = SubmissionScene;
