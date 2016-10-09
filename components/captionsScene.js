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

  render() {
    const imageHeight = 420, imageWidth = 420;

    const captions = [
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand'
    ]

    return (
      <View style={styles.container}>
        <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        <ScrollView style={styles.scrollContainer}>
          {captions.map((c, i) => (
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
