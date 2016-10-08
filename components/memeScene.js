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
      <View style={{paddingTop: 20}}>
        <Text>Meme Scene</Text>
      </View>
    )
  }
}

module.exports = Meme;
