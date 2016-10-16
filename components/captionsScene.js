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

import Api from '../lib/api';

class CaptionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;

    this.state = {
      captions: [],
      submission: null,
    }
  }

  componentDidMount() {
    fetch('https://superserious.ngrok.io/captions').then(function(response) {
      if( response.status > 299 ) { return console.error(response.status); }
      return response.json()
    }).then((body) => {
      this.setState({captions: body.captions})
    }).catch(function(err) {
      console.error(err);
    })

    Api.submissions.current().then((submission) => {
      console.log("got submission", submission)
      this.setState({
        submission: submission
      })
    }).catch(function(err) {
      console.error(err);
    })
  }

  _play = (filename) => {
    const url = `https://superserious.ngrok.io/${filename}`;
    AudioPlayer.playWithUrl(url);
  }

  _like = (id) => {
    if( !id ) { return console.error("No id provided to like function"); }

    fetch(`https://superserious.ngrok.io/captions/${id}/like`, {
      method: 'POST'
    }).then(function(response) {
      if( response.status > 299 ) { return console.error(response.status); }
    }).catch(function(err) {
      console.error(err);
    })
  }

  _hate = (id) => {
    if( !id ) { return console.error("No id provided to like function"); }

    fetch(`https://superserious.ngrok.io/captions/${id}/hate`, {
      method: 'POST'
    }).then( (response) => {
      if( response.status > 299 ) { return console.error(response.status); }

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
          <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (this.state.submission.height / this.state.submission.width)}} source={{uri: this.state.submission.image_url}} />
        :
          null
        }
        <ScrollView style={styles.scrollContainer}>
          {this.state.captions.map((c, i) => (
            <View key={i} style={styles.row}>
              <TouchableHighlight onPress={() => this._play(c.filename)}>
                <Image source={require('../images/Play.png')} />
              </TouchableHighlight>

              <Text style={styles.text}>{c.filename.substring(0,6)}</Text>

              <TouchableHighlight onPress={() => this._like(c.id)}>
                <Image source={require('../images/Submit.png')} />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this._hate(c.id)}>
                <Image source={require('../images/StopRecord.png')} />
              </TouchableHighlight>
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
