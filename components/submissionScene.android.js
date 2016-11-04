import React, { Component } from 'react';

import {
  Alert,
  StatusBar,
  View,
} from 'react-native';

import SubmissionOptions from './submissionOptions';
import Api from '../lib/api';

const InAppBilling = require("react-native-billing");

let isPurchasing = false;

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.navigator = props.navigator;
  }

  componentDidMount() {
    this.setState({
      products: [{
        priceString: "$0.99",
        title: "Now",
        description: "If you don't want to wait, you can pay us a few cents and we'll immediately replace the current photo with yours.",
      }]
    })
  }

  render() { return (
    <SubmissionOptions products={this.state.products}
                       purchasing={this.state.purchasing}
                       onPress={this._submit.bind(this)}
                       queueSize={this.props.queueSize}></SubmissionOptions>
  )}

  _submit(selection) {
    if( selection == 'paid' ) {
      this._pay();
    } else if( selection == 'free' ) {
      this.navigator.navigate('CaptionScene');
      Alert.alert('Your photo was put into the pile', 'Keep an eye out for it');
    } else {
      console.error("Unknown state", selection);
    }
  }

  _pay() {
    if( isPurchasing ) { return; }
    isPurchasing = true;

    this.setState({
      purchasing: true
    })

    InAppBilling.open().then(() => {
      InAppBilling.purchase('com.superserious.giggles.now');
    }).then((details) => {
      console.log("You purchased: ", details)
      InAppBilling.close()

      // TODO: verify receipt
      const base64EncodedReceipt = 'ANDROID';
      return Api.submissions.jumpQueue(this.props.submissionId, base64EncodedReceipt).then(() => {
        isPurchasing = false;
        this.navigator.navigate('CaptionScene');
      })
    }).catch((err) => {
      InAppBilling.close();
      console.error(err);
      Alert.alert('Purchase failed');
    });
  }
}

module.exports = SubmissionScene;
