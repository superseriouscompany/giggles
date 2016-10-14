import React, {Component} from 'react';

import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const InAppBilling = require("react-native-billing");

class SubmissionScene extends Component {
  render() {
    return (
      <View>
        <TouchableHighlight onPress={this.buy.bind(this)}>
          <Text>Hello</Text>
        </TouchableHighlight>
      </View>
    )
  }

  buy() {
    InAppBilling.open().then(() => {
      InAppBilling.purchase('android.test.purchased');
    }).then((details) => {
      console.log("You purchased: ", details)
      return InAppBilling.close()
    }).catch((err) => {
      console.error(err)
    })
  }
}

module.exports = SubmissionScene;
