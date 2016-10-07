import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'

class Meme extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
  }

  render = () => {
    return (
      <View>
        <Text onPress={() => this.navigator.navigate('cool')}>Meme Scene</Text>
      </View>
    )
  }
}

module.exports = Meme;
