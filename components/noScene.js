import React, {Component} from 'react';

import {
  Text,
  View
} from 'react-native';

class NoScene extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
        <Text>
          Nope. No scene found.
        </Text>
      </View>
    )
  }
}
