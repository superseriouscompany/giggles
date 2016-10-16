import React, { Component } from 'react';

import {
  Alert,
  CameraRoll,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import Api from '../lib/api';

class SubmissionsScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissions: []
    }
    this.navigator = props.navigator;
  }

  componentDidMount() {
    Api.submissions.all().then((submissions) => {
      console.log("got submissions", submissions);

      this.setState({
        submissions: submissions,
        loaded: 'loaded'
      })
    }).catch(function(err) {
      console.error("Unable to get submissions", err, err.stack);
    })
  }

  render() {
    return(
      <View style={{flex: 1, paddingTop: 20}}>
        <Text style={{textAlign: 'right'}} onPress={() => this.navigator.navigate('CaptionScene')}>forward</Text>
        <View style={styles.bg}>
          <TouchableOpacity onPress={this._uploadPhoto.bind(this)}>
            <Text style={styles.button}>Upload Photo</Text>
          </TouchableOpacity>

          <View style={{backgroundColor: 'tomato'}}>
            <Text>{this.state.loaded} {this.state.submissions.length} Photos</Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {this.state.submissions.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => this.navigator.navigate('CaptionScene')}>
                <Image source={{uri: s.image_url}} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (s.height / s.width)}}/>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }

  _uploadPhoto() {
    let options = {
      title: "Santi is a dumb dumb."
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return Alert.alert('User cancelled image picker');
      }
      if (response.error) {
        return Alert.alert('ImagePicker Error: ' + response.error);
      }

      var body = new FormData();
      body.append('photo', {uri: response.origURL || response.uri, name: 'photo.jpg', type: 'image/jpeg'});

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        if( xhr.status < 299 ) {
          this.navigator.navigate('SubmissionScene');
        } else {
          Alert.alert(xhr.status + ': ' + xhr.responseText);
        }
      }
      xhr.open('POST', 'https://superserious.ngrok.io/submissions');
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
  scrollContainer: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  button: {
    color: 'white',
  },
})

module.exports = SubmissionsScene;
