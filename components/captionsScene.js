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

    return (
      <View style={styles.container}>
        <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width * (imageHeight / imageWidth)}} source={{uri: `https://placehold.it/${imageWidth}x${imageHeight}`}} />
        <ScrollView style={{backgroundColor: 'gray'}}>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
          <Image source={require('../images/Play.png')}/>
          <Text>Yoyoyo</Text>
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
})

module.exports = CaptionsScene;
