import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'

class Cool extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {};
  }

  render = () => {
    return (
      <View style={{paddingTop: 20, paddingLeft: 20}}>
        <Text onPress={this.press.bind(this)}>Cool {this.state.nice}</Text>
      </View>
    )
  }

  press = () => {
    fetch("http://localhost:3000/foo", {
      method: 'POST'
    }).then((response) => {
      if( response.status > 299 ) {
        throw new Error(`Received unexpected status code ${response.status}`);
      }
      return response.json().then((body) => {
        this.setState({nice: body.good});
      })
    }).catch((err) => {
      console.error(err);
    })
  }
}

module.exports = Cool
