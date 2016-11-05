'use strict';

import React, {Component} from 'react';

import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Api from '../lib/api';

const InAppBilling = require("react-native-billing");

export default class Scratch extends Component {
  render() { return (
    <View style={{padding: 20}}>
      <TouchableOpacity onPress={this.purchase.bind(this)}>
        <Text>HALP</Text>
      </TouchableOpacity>
    </View>
  )}

  purchase() {
    InAppBilling.open().then(() => {
      return InAppBilling.purchase('com.superserious.giggles.now');
    }).then((details) => {
      const purchaseToken = details.purchaseToken;
      console.log(details);
      return Api.submissions.jumpQueueAndroid('nope', details.purchaseToken);
      // return Api.submissions.jumpQueue(this.props.submissionId, purchaseToken)
    }).then((body) => {
      console.log(body);
      // inapp:com.superserious.giggles:android.test.purchased
      InAppBilling.close();
      isPurchasing = false;
    }).catch((err) => {
      InAppBilling.close();
      console.error(err);
    });
  }
}
