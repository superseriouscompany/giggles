import React, {Component} from 'react';

import {
  Text,
  View
} from 'react-native';

export default class KilledScene extends Component {
  render() {
    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'space-around'}}>
        <Text style={{color: 'hotpink'}}>Please update me.</Text>
      </View>
    )
  }
}
