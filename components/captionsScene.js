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

    CurrentUser.likes().then((likes) => {
      return CurrentUser.hates().then((hates) => {
        return captionsPromise.then((captions) => {
          if( !isMounted ) { return console.log("Not mounted."); }

          // Add decoration for liked and score
          captions = captions.map(function(c) {
            if( likes.indexOf(c.id) !== -1 ) { c.liked = true; }
            c.score = (c.likes || 0) - (c.hates || 0);
            return c;
          })

          // Remove hated captions
          captions = captions.filter(function(c) {
            return hates.indexOf(c.id) === -1;
          })

          // Sort captions by score
          captions = captions.sort(function(c) {
            return -c.score
          })

          this.setState({captions: captions, captionsLoading: false})
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

    this.setState({
      captions: this.state.captions.map(function(c) {
        if( c.id === caption.id ) {
          c.playing = true;
          c.played  = true;
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
                        <Image style={styles.opaque} source={require('../images/Downvote.png')} />
                      </TouchableOpacity>

                      <View style={styles.scoreContainer}>
                        { c.score < -1 ?
                          <Text style={styles.badScore}>
                            { c.score }
                          </Text>
                        :
                          <Text style={styles.goodScore}>
                            { c.score }
                          </Text>
                        }
                        </View>

                      <TouchableOpacity onPress={() => this._like(c)}>
                        <Image style={styles.opaque} source={require('../images/Upvote.png')} />
                      </TouchableOpacity>

                    </View>
                  : c.liked ?
                    <View style={{flexDirection: 'row'}}>

                      <Image style={styles.translucentDownvote} source={require('../images/Downvote.png')} />

                      <View style={styles.scoreContainer}>
                        { c.score < -1 ?
                          <Text style={styles.badScore}>
                            { c.score }
                          </Text>
                        :
                          <Text style={styles.goodScore}>
                            { c.score }
                          </Text>
                        }
                      </View>

                      <Image style={styles.opaque} source={require('../images/Upvote.png')} />

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
  scrollContainer: {
    flexDirection: 'row',
    height:(windowSize.height - STATUSBAR_HEIGHT) * 0.55,
    width: windowSize.width,
    paddingTop: STATUSBAR_HEIGHT / 2,
  },
  noCaptionsImage: {
    position: 'absolute',
    width: windowSize.width,
    alignItems: 'center',
  },
  image: {
    height: (windowSize.height - STATUSBAR_HEIGHT) * 0.45,
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
  translucentDownvote: {
    opacity: 0.15,
  },
  opaque: {
    opacity: 1.0,
  },
  scoreContainer: {
    width: 32,
    height: 64,
    justifyContent: 'center',
  },
  badScore: {
    fontSize: 14,
    color: '#CB8982',
    textAlign: 'center',
  },
  goodScore: {
    fontSize: 14,
    color: '#82CBB6',
    textAlign: 'center',
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
