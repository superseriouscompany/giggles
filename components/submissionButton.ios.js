import React, { Component } from 'react';

import {
  Alert,
  NativeModules,
  Platform,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { InAppUtils } from 'NativeModules';

const products = [
  'com.superserious.steffigraffiti.gonext'
]

class SubmissionScene extends Component {
  state = {
    products: []
  }

  render() {
    const product = this.state.products && this.state.products[0];

    return (
      <View>
        { product ?
          <View>
            <Text>{product.title}</Text>
            <Text>{product.priceString}</Text>
            <TouchableHighlight onPress={() => this.purchase(product.identifier) }>
              <Text style={{color: 'blue'}}>
                Buy it
              </Text>
            </TouchableHighlight>
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
        Alert.alert('Purchase successful');
      } else {
        Alert.alert('Unknown response');
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

module.exports = SubmissionScene;
