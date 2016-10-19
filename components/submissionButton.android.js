import React, {Component} from 'react';

import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const InAppBilling = require("react-native-billing");

class SubmissionScene extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.buy.bind(this)}>
          <Text>Hello</Text>
        </TouchableOpacity>
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
