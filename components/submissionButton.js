import React, {Component} from 'react';

import {
  Image,
  TouchableOpacity,
} from 'react-native';

export default class SubmissionButton extends Component {
  render() {
    return (
      <TouchableOpacity style={{opacity: this.props.active ? 1 : 0.2}} onPress={this.props.onPress}>
        <Image source={require('../images/Submit.png')} />
      </TouchableOpacity>
    )
  }
}
