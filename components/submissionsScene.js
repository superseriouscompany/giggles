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
              <Submission key={i} submission={s} onPress={() => this.navigator.navigate('CaptionsScene', { submissionId: this.props.submission.id})}/>
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
      title: "Neil is a dumb dumb."
    }

    ImagePicker.showImagePicker(options, (response) => {
      if( response.didCancel ) { return; }
      if( response.error ) {
        if( response.error === 'Photo library permissions not granted' ) {
          return Alert.alert("Oops! You denied Photo Library permissions", "To fix this, go into your iPhone Settings > Giggles > Photos");
        }
        if( response.error === 'Camera permissions not granted' ) {
          return Alert.alert("Oops! You denied Camera permissions", "To fix this, go into your iPhone Settings > Giggles > Camera");
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
      xhr.open('POST', 'https://giggles.superserious.co/submissions');
      xhr.send(body);
    })
  }
}

class Submission extends Component {
  state = {}

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() { return (
    <TouchableOpacity onPress={this.props.onPress}>
      <CacheableImage source={{uri: this.props.submission.image_url}}
                      style={styles.scrollImage}
                      onLoadStart={() => this.mounted && this.setState({loading: true})}
                      onLoadEnd={() => this.mounted && this.setState({loading: false})}>

        { this.state.loading ?
          <ActivityIndicator
            style={[{transform: [{scale: 1.5}]}]}
            size="small"
            color="ghostwhite"
          />
        :
          null
        }

        <Image style={styles.darkRect} source={require('../images/DarkTranslucentRectangle.png')}>
          <View style={styles.backdropView}>
            <Text style={styles.date}>{this.props.submission.publishedAt}</Text>
          </View>
        </Image>
      </CacheableImage>
    </TouchableOpacity>
  )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})

module.exports = SubmissionsScene;
