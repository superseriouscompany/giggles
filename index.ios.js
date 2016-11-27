'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Dimensions,
  Text,
  View,
} from 'react-native';

import { InAppUtils }   from 'NativeModules';
import Api              from './lib/api';
import CaptionScene     from './components/captionScene';
import CaptionsScene    from './components/captionsScene';
import SubmissionsScene from './components/submissionsScene';
import SubmissionScene  from './components/submissionScene';
import NoScene          from './components/noScene';
import KilledScene      from './components/killedScene';
import TermsScene       from './components/termsScene';
import CurrentUser      from './lib/currentUser';

const PushNotification = require('react-native-push-notification');

PushNotification.configure({
  onRegister: function(token) {
    Api.pushTokens.registerIOS(token.token);
  },
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification );
  },
  popInitialNotification: true,
  requestPermissions: true,
})

class RootNav extends Component {
  constructor(props) {
    super(props);
    this.state = { props: {}};
    this.state.scene = 'CaptionScene';

    this.navigator = {
      navigate: (component, props) => {
        let stateChange = { scene: component, props: props || {} };
        if( props && props.clearTerms ) { stateChange.needsTerms = false; }
        this.setState(stateChange);
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

    CurrentUser.hasAcceptedTerms().then(yes => {
      if( yes ) return;
      this.setState({
        needsTerms: true,
      })
    }).catch(err => {
      // swallow error on accepting terms
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
        : this.state.needsTerms ?
          <TermsScene {...this.state.props} navigator={this.navigator}/>
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
