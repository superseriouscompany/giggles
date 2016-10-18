import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {AudioPlayer} from 'react-native-audio';
import CacheableImage from 'react-native-cacheable-image'
import Api from '../lib/api';

let isMounted = true;

class CaptionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;

    this.state = {
      captions: [],
      submission: null,
      captionsLoading: true,
    }
  }

  componentDidMount() {
    Api.submissions.current().then((submission) => {
      if( !isMounted ) { return; }

      Api.captions.all({submission_id: submission.id}).then((captions) => {
        if( !isMounted ) { return; }

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
      <View style={styles.container}>
        <Text onPress={() => this.navigator.navigate('CaptionScene')}>back</Text>
        { this.state.submission ?
          <CacheableImage
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (this.state.submission.height / this.state.submission.width)}}
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
          {this.state.captions.map((c, i) => (
            <View key={i} style={styles.row}>
              <TouchableHighlight onPress={() => this._play(c)}>
                <Image source={require('../images/Play.png')} />
              </TouchableHighlight>

              { c.playing ?
                <Text style={[styles.text, {color: c.color}]}>Playing...</Text>
              :
                <Text style={[styles.text, {color: c.color}]}>{c.color}</Text>
              }

              { c.played && !c.rated ?
                <View style={{flexDirection: 'row'}}>
                  <TouchableHighlight onPress={() => this._like(c)}>
                    <Image source={require('../images/Submit.png')} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => this._hate(c)}>
                    <Image source={require('../images/StopRecord.png')} />
                  </TouchableHighlight>
                </View>
              :
                null
              }
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  scrollContainer: {
    backgroundColor: '#dfdfdf'
  },

  text: {
    color: '#666'
  }
})

module.exports = CaptionsScene;
