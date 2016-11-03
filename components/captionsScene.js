import React, { Component } from 'react';

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {AudioPlayer} from 'react-native-audio';
import Api from '../lib/api';
import CacheableImage from 'react-native-cacheable-image';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 21 : 0;
const windowSize = Dimensions.get('window');

let isMounted;

const CurrentUser = require('../lib/currentUser');

class CaptionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
    this.submissionId = props.submissionId;

    this.state = {
      captions: [],
      submission: null,
      captionsLoading: true,
    }
  }

  componentDidMount() {
    isMounted = true;

    const captionsPromise = this.submissionId ?
      Api.captions.forSubmission(this.submissionId) :
      Api.captions.current();

    CurrentUser.listens().then((listens) => {
      return CurrentUser.likes().then((likes) => {
        return CurrentUser.hates().then((hates) => {
          return captionsPromise.then((captions) => {
            if( !isMounted ) { return console.log("Not mounted."); }

            captions = captions.map(function(c) {
              let randomColor = 0;
              for( var i = 0; i < c.id.length; i++ ) {
                randomColor += c.id.charCodeAt(i);
              }
              c.color = '#' + parseInt(randomColor*10000000).toString(16).slice(0, 6);

              if( likes.indexOf(c.id) !== -1 ) { c.liked = true; }
              if( listens.indexOf(c.id) !== -1 ) { c.listened = true; }
              return c;
            })

            captions = captions.filter(function(c) {
              return hates.indexOf(c.id) === -1;
            })

            this.setState({captions: captions, captionsLoading: false})
          })
        })
      })
    }).catch(console.error);

    const submissionsPromise = this.submissionId ?
      Api.submissions.get(this.submissionId) :
      Api.submissions.current();

    submissionsPromise.then((submission) => {
      if( !isMounted ) { return; }

      this.setState({
        submission: submission,
      })
    }).catch(function(err) {
      console.error(err);
    })
  }

  componentWillUnmount() {
    isMounted = false;

    AudioPlayer.stop();
    AudioPlayer.onProgress = null;
    AudioPlayer.onFinished = null;
    AudioPlayer.progressSubscription && AudioPlayer.progressSubscription.remove();
    AudioPlayer.finishedSubscription && AudioPlayer.finishedSubscription.remove();
  }

  _play = (caption) => {
    const url = `https://giggles.superserious.co/${caption.filename}`;
    AudioPlayer.onProgress = (data) => {
      console.log("Progress", data);
    };
    AudioPlayer.onFinished = () => {
      this.setState({
        captions: this.state.captions.map(function(c) {
          if( c.id === caption.id ) {
            c.playing = false;
          }
          return c;
        })
      })
    };
    AudioPlayer.setProgressSubscription();
    AudioPlayer.setFinishedSubscription();

    AudioPlayer.stop();
    AudioPlayer.playWithUrl(url);

    CurrentUser.addListen(caption.id);

    this.setState({
      captions: this.state.captions.map(function(c) {
        if( c.id === caption.id ) {
          c.playing = true;
          c.played  = true;
          c.listened = true;
        }
        return c;
      })
    })
  }

  _like = (caption) => {
    if( !caption ) { return console.error("No caption provided to like function"); }

    Api.captions.like(caption.id).then(() => {
      CurrentUser.addLike(caption.id);

      if( !isMounted ) { return; }

      this.setState({
        captions: this.state.captions.map(function(c) {
          if( c.id === caption.id ) {
            c.liked = true;
          }

          return c;
        })
      });
    }).catch(function(err) {
      console.error(err);
    })
  }

  _hate = (caption) => {
    if( !caption ) { return console.error("No caption provided to like function"); }

    Api.captions.hate(caption.id).then(() => {
      CurrentUser.addHate(caption.id);

      if( !isMounted ) { return; }

      this.setState({
        captions: this.state.captions.filter(function(c) { return c.id !== caption.id; })
      });
    }).catch(function(err) {
      console.error(err);
    })
  }

  render() {
    return (
      <View style={styles.imageBackground}>
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>

        <View style={styles.background}>
          { this.state.submission ?
            <CacheableImage
              style={styles.image}
              source={{uri: this.state.submission.image_url}}
              onLoadStart={ () => { isMounted && this.setState({imageLoading: true}) }}
              onLoadEnd={ () => { isMounted && this.setState({imageLoading: false}) }}
              />
          :
            null
          }
          { this.state.imageLoading ?
            <ActivityIndicator
              style={[styles.centering, {transform: [{scale: 1.5}]}]}
              size="small"
              color="ghostwhite"
            />
          :
            null
          }

          { this.state.captionsLoading ?
            <ActivityIndicator
              style={[styles.centering, {transform: [{scale: 1.5}]}]}
              size="small"
              color="ghostwhite"
            />
          :
            null
          }

          <ScrollView style={styles.scrollContainer}>
            { this.state.captions.length == 0 && !this.state.captionsLoading ?
              <View style={styles.noCaptionsImage}>
                <TouchableOpacity onPress={() => this.navigator.navigate('CaptionScene')}>
                  <Image source={require('../images/NoCaptionsYet.png')}/>
                </TouchableOpacity>
              </View>
            :
              null
            }

            {this.state.captions.map((c, i) => (
              <View key={i} style={styles.row}>
                <View style={styles.leftHalfRow}>
                  { c.listened ?
                    null
                  :
                    <Text style={{color: 'bisque'}}>[new]</Text>
                  }
                  { c.playing ?
                    <Text style={{color: 'cornsilk'}}>[playing]</Text>
                  :
                    null
                  }
                  <TouchableOpacity onPress={() => this._play(c)}>
                    <Image source={require('../images/PlayAudio.png')}>
                      <View style={styles.backdropView}>
                        <Text style={styles.duration}>0:{`0${Math.round(c.duration)}`.slice(-2)}</Text>
                      </View>
                    </Image>
                  </TouchableOpacity>
                </View>

                <View style={styles.rightHalfRow}>
                  { c.played && !c.liked ?
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => this._hate(c)}>
                        <Image style={styles.translucentAnger} source={require('../images/Anger.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._like(c)}>
                        <Image style={styles.translucentLaughing} source={require('../images/Laughing.png')} />
                      </TouchableOpacity>
                    </View>
                  : c.liked ?
                    <View>
                      <Image style={styles.opaqueLaughing} source={require('../images/Laughing.png')} />
                    </View>
                  :
                    null
                  }
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.container}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => this.navigator.navigate('CaptionScene')}>
              <Image source={require('../images/GoScreenLeft.png')}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  debug: {
    backgroundColor: 'pink',
  },
  centering: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: windowSize.width,
    height: windowSize.height,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageBackground: {
    backgroundColor: '#181818',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowSize.width,
  },
  background: {
    backgroundColor: '#181818',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: STATUSBAR_HEIGHT,
  },
  imageContainer: {
    flexDirection: 'column',
    flex: .5,
    alignItems: 'center',
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: .5,
    width: windowSize.width,
    marginTop: STATUSBAR_HEIGHT,
  },
  noCaptionsImage: {
    position: 'absolute',
    width: windowSize.width,
    alignItems: 'center',
  },
  image: {
    flex: .5,
    width: windowSize.width,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: windowSize.width,
    height: 64,
    paddingRight: 5,
  },
  leftHalfRow: {
    flex: .5,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightHalfRow: {
    flex: .5,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  translucentAnger: {
    opacity: 0.5,
  },
  translucentLaughing: {
    opacity: 0.5,
  },
  opaqueLaughing: {
    opacity: 1.0,
  },
  audioGif: {
    flex: .5
  },
  text: {
    color: '#666'
  },
  duration: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    paddingTop: 23.5,
    paddingLeft: 30,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

module.exports = CaptionsScene;
