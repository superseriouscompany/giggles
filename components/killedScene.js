import React, {Component} from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class KilledScene extends Component {
  render() {
    return (
      <View style={styles.background}>
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>
        <Text style={styles.updateText}>
          There is a new update available{"\n"}
          on the App Store.{"\n"}
          {"\n"}
          Pretty please go update.
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#181818',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },
  updateText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: -30,
  }
});
