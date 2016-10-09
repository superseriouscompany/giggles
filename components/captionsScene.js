import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';

class CaptionsScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;

    this.state = {
      captions: []
    }
  }

  componentDidMount() {
    fetch('https://bf9083e7.ngrok.io/captions').then(function(response) {
      if( response.status > 299 ) { return console.error(response.status); }
      return response.json()
    }).then((body) => {
      console.log("got body", body);
      this.setState({captions: body.captions})
    }).catch(function(err) {
      console.error(err);
    })
  }


  render() {
    const imageHeight = 420, imageWidth = 420;

    return (
      <View style={styles.container}>
        <Text onPress={() => this.navigator.pop()}>back</Text>
        <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        <ScrollView style={styles.scrollContainer}>
          {this.state.captions.map((c, i) => (
            <View key={i} style={styles.row}>
              <Image source={require('../images/Play.png')}/>
              <Text style={styles.text}>{c}</Text>
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
