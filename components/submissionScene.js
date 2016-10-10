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
  render() {
    return(
      <View style={styles.bg}>
        <TouchableOpacity onPress={this._uploadPhoto.bind(this)}>
          <Text style={styles.button}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.press.bind(this)}>
          <Text style={styles.button}>Random Photo</Text>
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

      console.log("chosen or taken", photo);
      var body = new FormData();
      body.append('photo', {uri: response.origURL, name: 'photo.jpg'});

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        Alert.alert(xhr.status + ': ' + xhr.responseText);
      }
      xhr.open('POST', 'https://bf9083e7.ngrok.io/foo');
      xhr.send(body);
    })
  }

  press = () => {
    this._randomPhoto().then(function(photo) {
      console.log("random", photo);
      var body = new FormData();
      body.append('photo', {...photo, name: 'photo.jpg'});

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        Alert.alert(xhr.status + ': ' + xhr.responseText);
      }
      xhr.open('POST', 'https://bf9083e7.ngrok.io/foo');
      xhr.send(body);
    })
  }

  _randomPhoto = () => {
    return CameraRoll.getPhotos(
      {first: 20}
    ).then(
      (data) => {
        var edges = data.edges;
        var edge = edges[0];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          return randomPhoto;
        }
      },
      (error) => undefined
    );
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
