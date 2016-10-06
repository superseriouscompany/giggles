import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'

class Source extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
  }

  render = () => {
    return (
      <View>
        <Text onPress={() => this.navigator.navigate('meme')}>Meme</Text>
        <Text onPress={() => this.navigator.navigate('camera')}>Camera</Text>
      </View>
    )
  }
}

module.exports = Source;
