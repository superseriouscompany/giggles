'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Dimensions,
  Text,
  View,
} from 'react-native';

import CaptionScene     from './components/captionScene';
import CaptionsScene    from './components/captionsScene';
import SubmissionsScene from './components/submissionsScene';
import SubmissionScene  from './components/submissionScene';
import NoScene          from './components/noScene';

class RootNav extends Component {
  constructor(props) {
    super(props);
    this.state = { scene: 'CaptionScene', props: {} }

    this.navigator = {
      navigate: (component, props) => {
        this.setState({scene: component, props: props || {}})
      }
    }
  }

  componentDidMount() {
    const CurrentUser = require('./lib/currentUser');
    CurrentUser.myId().then((id) => {
      this.setState({myId: id})
    }).catch(console.error);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{color: 'lavenderblush', backgroundColor: 'teal', padding: 20}}>My id: {this.state.myId}</Text>
        {
          this.state.scene == 'CaptionScene' ?
            <CaptionScene {...this.state.props} navigator={this.navigator}/>
          : this.state.scene == 'CaptionsScene' ?
            <CaptionsScene {...this.state.props} navigator={this.navigator}/>
          : this.state.scene == 'SubmissionsScene' ?
            <SubmissionsScene {...this.state.props} navigator={this.navigator}/>
          : this.state.scene == 'SubmissionScene' ?
            <SubmissionScene {...this.state.props} navigator={this.navigator}/>
          :
            <NoScene />
        }
      </View>
    )
  }
}

AppRegistry.registerComponent('steffigraffiti', () => RootNav);
