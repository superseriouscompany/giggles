import React, { Component } from 'react';

import {
  Alert,
  StatusBar,
  View,
} from 'react-native';

import SubmissionOptions from './submissionOptions';
import Api from '../lib/api';
import { InAppUtils } from 'NativeModules';

const products = [
  'com.superserious.giggles.now'
]

let isPurchasing = false;

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.navigator = props.navigator;
  }

  componentDidMount() {
    InAppUtils.loadProducts(products, (err, products) => {
      if( err ) { console.error(err); }
      this.setState({
        products: products,
      });
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

    InAppUtils.purchaseProduct(this.state.products[0].identifier, (err, response) => {
      if( err ) {
        // we get this code if they hit cancel
        if( err.code == 'ESKERRORDOMAIN2' && err.domain == 'SKErrorDomain' ) {
          return this.setState({purchasing: false});
        }
        return console.error(err);
      }

      if( response && response.productIdentifier ) {
        InAppUtils.receiptData((err, base64EncodedReceipt)=> {
          if(err) {
            Alert.alert('Verification failed');
          }
          Api.submissions.jumpQueue(this.props.submissionId, base64EncodedReceipt).then(() => {
            isPurchasing = false;
            this.navigator.navigate('CaptionScene');
          }).catch(console.error);
        });
      } else {
        console.error(response);
        Alert.alert('Purchase failed');
      }
    })
  }
}

module.exports = SubmissionScene;
