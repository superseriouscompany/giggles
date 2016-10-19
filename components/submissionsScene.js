import React, { Component } from 'react';

import {
  Alert,
  CameraRoll,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Api from '../lib/api';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 21 : 0;
const windowSize = Dimensions.get('window');

let isMounted;

class SubmissionsScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissions: []
    }
    this.navigator = props.navigator;
  }

  componentDidMount() {
    isMounted = true;

    Api.submissions.all().then((submissions) => {
      if( !isMounted ) { return; }

      this.setState({
        submissions: submissions,
        loaded: 'loaded'
      })
    }).catch(function(err) {
      console.error("Unable to get submissions", err, err.stack);
    })
  }

  componentWillUnmount() {
    isMounted = false;
  }

  render() {
    return(
      <View style={styles.background}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>

        <View style={styles.bg}>
          { this.state.uploading ?
            <Text style={styles.button}>Uploading...</Text>
          :
            <TouchableOpacity onPress={this._uploadPhoto.bind(this)}>
              <Text style={styles.button}>Upload Photo</Text>
            </TouchableOpacity>
          }

          <View style={{backgroundColor: 'tomato'}}>
            <Text>{this.state.loaded} {this.state.submissions.length} Photos</Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {this.state.submissions.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => this.navigator.navigate('CaptionsScene', { submissionId: s.id})}>
                <Image source={{uri: s.image_url}} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (s.height / s.width)}}/>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.container}>
          <View style={styles.topRow}>
            <TouchableHighlight onPress={() => this.navigator.navigate('CaptionScene')}>
              <Image source={require('../images/GoScreenRight.png')}/>
            </TouchableHighlight>
          </View>
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
        if( response.error === 'Photo library permissions not granted' ) {
          return Alert.alert("Hey asshole", "Give us photo library access.");
        }
        if( response.error === 'Camera permissions not granted' ) {
          return Alert.alert("Hey asshole", "Give us camera access.");
        }
        return Alert.alert('ImagePicker Error: ' + response.error);
      }


      this.setState({
        uploading: true
      })
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
  background: {
    backgroundColor: '#181818',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: STATUSBAR_HEIGHT,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowSize.width,
  },
  bg: {
    backgroundColor: '#181818',
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
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
  topRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
})

module.exports = SubmissionsScene;
