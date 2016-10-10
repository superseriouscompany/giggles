import React, { Component } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

class SubmissionsScene extends Component {
  render() {
    return(
      <View style={styles.bg}>
        <TouchableOpacity onPress={this._uploadPhoto.bind(this)}>
          <Text style={styles.button}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _uploadPhoto() {
    let options = {
      title: 'Santi farts too much.'
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return Alert.alert('User cancelled image picker');
      }
      if (response.error) {
        return Alert.alert('ImagePicker Error: ' + response.error);
      }

      Alert.alert(response.uri);
    })
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
