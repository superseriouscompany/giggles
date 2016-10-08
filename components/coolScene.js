import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'

class Cool extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
  }

  render = () => {
    return (
      <View style={{backgroundColor: 'black'}}>
        <Text onPress={() => this.navigator.popN(2)}>Cool</Text>
      </View>
    )
  }
}

module.exports = Cool;
