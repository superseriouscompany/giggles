import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  Platform,
  StatusBar,
} from 'react-native';

import {AudioPlayer} from 'react-native-audio';
import Api from '../lib/api';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 21 : 0;
const windowSize = Dimensions.get('window');

let isMounted;

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

    captionsPromise.then((captions) => {
      if( !isMounted ) { return console.log("Not mounted."); }

      captions = captions.map(function(c) {
        let randomColor = 0;
        for( var i = 0; i < c.id.length; i++ ) {
          randomColor += c.id.charCodeAt(i);
        }
        c.color = '#' + parseInt(randomColor*10000000).toString(16).slice(0, 6);
        return c;
      })

      this.setState({captions: captions, captionsLoading: false})
    }).catch(function(err) {
      console.error(err);
    })

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
  }

  _play = (caption) => {
    const url = `https://superserious.ngrok.io/${caption.filename}`;
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
      if( !isMounted ) { return; }

      this.setState({
        captions: this.state.captions.map(function(c) {
          if( c.id === caption.id ) {
            c.rated = true;
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
      if( !isMounted ) { return; }

      this.setState({
        captions: this.state.captions.filter(function(c) { return c.id !== id; })
      });
    }).catch(function(err) {
      console.error(err);
    })
  }

  render() {
    return (
      <View style={styles.imageBackground}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>

        <View style={styles.background}>
          { this.state.submission ?
            <Image
              style={styles.image}
              source={{uri: this.state.submission.image_url}}
              onLoadStart={ () => { this.setState({imageLoading: true}) }}
              onLoadEnd={ () => { this.setState({imageLoading: false}) }}
              />
          :
            null
          }
          { this.state.imageLoading ?
            <Text style={{color: 'cornflowerblue'}}>Loading image...</Text>
          :
            null
          }

          { this.state.captionsLoading ?
            <Text style={{color: 'blanchedalmond'}}>Loading captions...</Text>
          :
            null
          }

          <ScrollView style={styles.scrollContainer}>
            { this.state.captions.length == 0 && !this.state.captionsLoading ?
              <Text style={{color: 'aquamarine'}}>No captions yet.</Text>
            :
              null
            }

            {this.state.captions.map((c, i) => (
              <View key={i} style={styles.row}>
                <View style={styles.leftHalfRow}>
                  <TouchableHighlight onPress={() => this._play(c)}>
                    <Image source={require('../images/PlayAudio.png')}>
                      <View style={styles.backdropView}>
                        <Text style={styles.duration}>4:20</Text>
                      </View>
                    </Image>
                  </TouchableHighlight>

                  { c.playing ?
                    <Image style={styles.audioGif} source={require('../images/audioPlaying.gif')} />
                  :
                    <Text style={[styles.text]}></Text>
                  }
                </View>

                <View style={styles.rightHalfRow}>
                  { c.played && !c.rated ?
                    <View style={{flexDirection: 'row'}}>
                      <TouchableHighlight onPress={() => this._hate(c)}>
                        <Image source={require('../images/Anger.png')} />
                      </TouchableHighlight>
                      <TouchableHighlight onPress={() => this._like(c)}>
                        <Image source={require('../images/Laughing.png')} />
                      </TouchableHighlight>
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
            <TouchableHighlight onPress={() => this.navigator.navigate('CaptionScene')}>
              <Image source={require('../images/GoScreenLeft.png')}/>
            </TouchableHighlight>
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
  imageBackground: {
    backgroundColor: 'black',
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
    backgroundColor: 'black',
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
