import React, { Component } from 'react';

import {
  ActivityIndicator,
  Alert,
  CameraRoll,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Api from '../lib/api';
import CacheableImage from 'react-native-cacheable-image';
import moment from 'moment';

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

      const offset = (new Date).getTimezoneOffset() *60*1000;
      const now = new Date;
      const oneDay = 24 * 60 * 60 * 1000;

      submissions = submissions.map((s) => {
        const publishedAt = moment(s.publishedAt);
        const diff = moment(now).diff(publishedAt);
        if( diff < oneDay ) { s.publishedAt = 'today'; }
        else if( diff < oneDay * 2 ) { s.publishedAt = 'yesterday'; }
        else { s.publishedAt = publishedAt.format('MMM D'); }
        return s;
      })

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
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>

        <View style={styles.bg}>
          <View style={styles.uploadBackground}>
            { this.state.uploading ?
              <ActivityIndicator
                style={[styles.loading, {transform: [{scale: 1.5}]}]}
                size="small"
                color="ghostwhite"
              />
            :
              <TouchableOpacity onPress={this._uploadPhoto.bind(this)} accessible={true} accessibilityLabel={'Upload photo'}>
                <Image source={require('../images/UploadImage.png')} />
              </TouchableOpacity>
            }

            <Image style={styles.darkRect} source={require('../images/DarkTranslucentRectangle.png')}>
              <View style={styles.backdropView}>
                <Text style={styles.date}>tomorrow</Text>
              </View>
            </Image>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {this.state.submissions.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => this.navigator.navigate('CaptionsScene', { submissionId: s.id})}>
                <CacheableImage source={{uri: s.image_url}} style={styles.scrollImage}>
                  <Image style={styles.darkRect} source={require('../images/DarkTranslucentRectangle.png')}>
                    <View style={styles.backdropView}>
                      <Text style={styles.date}>{s.publishedAt}</Text>
                    </View>
                  </Image>
                </CacheableImage>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.container}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => this.navigator.navigate('CaptionScene')}>
              <Image source={require('../images/GoScreenRight.png')}/>
            </TouchableOpacity>
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
          const json = JSON.parse(xhr.responseText);
          if( isMounted ) {
            this.navigator.navigate('SubmissionScene', { submissionId: json.id, queueSize: json.queueSize });
          }
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
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 35,
  },
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
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  uploadBackground: {
    flex: 0.19,
    width: windowSize.width,
    alignItems: 'center',
  },
  darkRect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  date: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    paddingTop: 19.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  scrollContainer: {
    flex: 0.81,
  },
  scrollImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.666,
  },
  topRow: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})

module.exports = SubmissionsScene;
