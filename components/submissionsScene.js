import React, { Component } from 'react';

import {
  Alert,
  CameraRoll,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

class SubmissionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
  }

  render() {
    return(
      <View style={{flex: 1, paddingTop: 20}}>
        <Text style={{textAlign: 'right'}} onPress={() => this.navigator.navigate('CaptionScene')}>forward</Text>
        <View style={styles.bg}>
          <TouchableOpacity onPress={this._uploadPhoto.bind(this)}>
            <Text style={styles.button}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _uploadPhoto() {
    let options = {
      title: "You have a better chance of farting a hole through your sheets."
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return Alert.alert('User cancelled image picker');
      }
      if (response.error) {
        return Alert.alert('ImagePicker Error: ' + response.error);
      }

      var body = new FormData();
      body.append('photo', {uri: response.origURL || response.uri, name: 'photo.jpg'});

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        if( xhr.status === 200 ) {
          Alert.alert("Uploaded.")
        } else {
          Alert.alert(xhr.status + ': ' + xhr.responseText);
        }
      }
      xhr.open('POST', 'https://superserious.ngrok.io/foo');
      xhr.send(body);
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
