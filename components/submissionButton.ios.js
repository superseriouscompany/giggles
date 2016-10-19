import React, { Component } from 'react';

import {
  Alert,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { InAppUtils } from 'NativeModules';
import Api from '../lib/api';

const products = [
  'com.superserious.steffigraffiti.gonext'
]

class SubmissionButton extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
    this.state = { products: [] }
  }

  render() {
    const product = this.state.products && this.state.products[0];

    return (
      <View>
        { product ?
          <View>
            <Text>{product.title} {this.props.submissionId}</Text>
            <Text>{product.priceString}</Text>
            <TouchableOpacity onPress={() => this.purchase(product.identifier) }>
              <Text style={{color: 'blue'}}>
                Buy it
              </Text>
            </TouchableOpacity>
          </View>
        : this.state.loaded ?
          <Text>No Products Available</Text>
        :
          <Text>Loading products...</Text>
        }
      </View>
    )
  }

  purchase(identifier) {
    InAppUtils.purchaseProduct(identifier, (err, response) => {
      if( err ) { return console.error(err); }

      if( response && response.productIdentifier ) {
        InAppUtils.receiptData((error, base64EncodedReceipt)=> {
          if(error) {
            console.error(error);
            Alert.alert('Verification failed');
          }
          Api.submissions.jumpQueue(this.props.submissionId, base64EncodedReceipt).then(() => {
            this.navigator.navigate('CaptionScene');
          }).catch(console.error);
        });
      } else {
        console.error(response);
        Alert.alert('Purchase failed');
      }
    })
  }

  componentDidMount() {
    InAppUtils.loadProducts(products, (err, products) => {
      if( err ) { console.error(err); }
      this.setState({
        products: products,
        loaded: true
      });
    })
  }
}

module.exports = SubmissionButton;
