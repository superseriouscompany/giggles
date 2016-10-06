import React, { Component } from 'react';
import {
  Text
} from 'react-native'

class Source extends Component  {
  constructor(props) {
    super(props);
    this.onPress = props.onPress;
  }

  render = () => {
    return (
      <Text onPress={this.onPress}>Source Scene</Text>
    )
  }
}

module.exports = Source;
