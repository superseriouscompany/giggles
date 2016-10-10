import React, { Component } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

class SubmissionsScene extends Component {
  render() {
    return(
      <View style={styles.bg}>
        <TouchableOpacity onPress={this._choosePhoto.bind(this)}>
          <Text style={styles.button}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._takePhoto.bind(this)}>
          <Text style={styles.button}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _takePhoto() {
    Alert.alert('Take');
  }

  _choosePhoto() {
    Alert.alert('Choose');
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: 'black',
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    color: 'white',
  }
})

module.exports = SubmissionsScene;
