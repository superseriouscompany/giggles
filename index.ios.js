'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Dimensions,
  Text,
  View,
} from 'react-native';

import { InAppUtils } from 'NativeModules';
import Api from './lib/api';
import CaptionScene     from './components/captionScene';
import CaptionsScene    from './components/captionsScene';
import SubmissionsScene from './components/submissionsScene';
import SubmissionScene  from './components/submissionScene';
import NoScene          from './components/noScene';
import KilledScene      from './components/killedScene';

class RootNav extends Component {
  constructor(props) {
    super(props);
    this.state = { props: {}};
    this.state.scene = 'CaptionScene';

    this.navigator = {
      navigate: (component, props) => {
        this.setState({scene: component, props: props || {}})
      }
    }
  }

  componentDidMount() {
    Api.killSwitch().then(kill => {
      if( !kill ) return;
      this.setState({
        killed: true,
      })
    }).catch(err => {
      // swallow error on kill switch
      console.log(err);
    })
  }

  render() {
    // const Poop = require('./components/poop');
    // return <Poop />;

    return (
      <View style={{flex: 1}}>
        { this.state.killed ?
          <KilledScene />
        : this.state.scene == 'CaptionScene' ?
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

AppRegistry.registerComponent('giggles', () => RootNav);
