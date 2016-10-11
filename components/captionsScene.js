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

class CaptionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;

    this.state = {
      captions: []
    }
  }

  componentDidMount() {
    fetch('https://superserious.ngrok.io/captions').then(function(response) {
      if( response.status > 299 ) { return console.error(response.status); }
      return response.json()
    }).then((body) => {
      console.log("got body", body);
      this.setState({captions: body.captions})
    }).catch(function(err) {
      console.error(err);
    })
  }

  _play = (filename) => {
    const url = `https://superserious.ngrok.io/${filename}`;
    AudioPlayer.playWithUrl(url);
  }

  render() {
    const imageHeight = 420, imageWidth = 420;

    return (
      <View style={styles.container}>
        <Text onPress={() => this.navigator.navigate('CaptionScene')}>back</Text>
        <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        <ScrollView style={styles.scrollContainer}>
          {this.state.captions.map((c, i) => (
            <View key={i} style={styles.row}>
              <TouchableHighlight onPress={() => this._play(c.filename)}>
                <Image source={require('../images/Play.png')} />
              </TouchableHighlight>
              <Text style={styles.text}>{c.filename}</Text>
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
