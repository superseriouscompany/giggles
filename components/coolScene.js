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
    var body = new FormData();
    body.append('cool', 'nice');
    body.append('good', 'great');

    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = (e) => {
      if( xhr.readyState !== 4 ) { return; }

      console.log(xhr.status, xhr.responseText);
    }
    xhr.open('POST', 'http://localhost:3000/foo');
    xhr.send(body);
  }
}

module.exports = Cool
