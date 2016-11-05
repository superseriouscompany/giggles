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
import ImageResizer from 'react-native-image-resizer';

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
          <ScrollView>
            <View style={styles.uploadBackground}>
              { this.state.uploading ?
                <ActivityIndicator
                  style={[styles.loading, {transform: [{scale: 1.5}]}]}
                  size="small"
                  color="ghostwhite"
                />
              :
                <TouchableOpacity style={styles.uploadButton} onPress={this._uploadPhoto.bind(this)} accessible={true} accessibilityLabel={'Upload photo'}>
                  <Image source={require('../images/UploadImage.png')} />
                </TouchableOpacity>
              }

              <Image style={styles.leftDarkRect} source={require('../images/DarkTranslucentRectangle.png')}>
                <View style={styles.backdropView}>
                  <Text style={styles.date}>tomorrow</Text>
                </View>
              </Image>
            </View>

            {this.state.submissions.map((s, i) => (
              <Submission key={i} submission={s} onPress={() => this.navigator.navigate('CaptionsScene', { submissionId: s.id})}/>
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
      title: "Submit a photo"
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

      ImageResizer.createResizedImage(response.origURL || response.uri, 750, 750, 'JPEG', 80).then((resizedImageUri) => {
        return Api.submissions.create(resizedImageUri);
      }).then((payload) => {
        if( isMounted ) {
          this.navigator.navigate('SubmissionScene', { submissionId: payload.id, queueSize: payload.queueSize });
        }
      }).catch((err) => {
        console.error(err);
      });
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

        <Image style={styles.leftDarkRect} source={require('../images/DarkTranslucentRectangle.png')}>
          <View style={styles.backdropView}>
            <Text style={styles.date}>{this.props.submission.publishedAt}</Text>
          </View>
        </Image>

        <View style={[styles.backdropView, {position: 'absolute', bottom: 0, right: 0}]}>
          <TouchableOpacity onPress={this.reportSubmission.bind(this)}>
            <Image source={require('../images/Flag.png')} />
          </TouchableOpacity>
        </View>
      </CacheableImage>
    </TouchableOpacity>
  )}

  reportSubmission() {
    Api.submissions.report(this.props.submission.id).then(() => {
      Alert.alert("You reported an issue with this submission.", "We'll look into it.");
    }).catch((err) => {
      console.error(err);
    })
  }
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: -2,
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
    width: windowSize.width,
    height: Dimensions.get('window').width * 0.666 - STATUSBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    paddingBottom: STATUSBAR_HEIGHT / 2 + 2,
  },
  leftDarkRect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  rightDarkRect: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  date: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    paddingTop: 19.5,
    backgroundColor: 'rgba(0,0,0,0)',
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
