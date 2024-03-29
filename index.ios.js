'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Dimensions,
  Text,
  View,
} from 'react-native';

import Api              from './lib/api';
import CaptionScene     from './components/captionScene';
import CaptionsScene    from './components/captionsScene';
import SubmissionsScene from './components/submissionsScene';
import SubmissionScene  from './components/submissionScene';
import NoScene          from './components/noScene';
import KilledScene      from './components/killedScene';
import TermsScene       from './components/termsScene';
import Scratch          from './components/scratch';
import CurrentUser      from './lib/currentUser';

import FCM from 'react-native-fcm';

class RootNav extends Component {
  constructor(props) {
    super(props);
    this.state = { props: {}};

    this.navigator = {
      navigate: (component, props) => {
        let stateChange = { scene: component, props: props || {} };
        if( props && props.clearTerms ) { stateChange.needsTerms = false; }
        this.setState(stateChange);
      }
    }
  }

  componentDidMount() {
    // FCM.requestPermissions();
    // FCM.getFCMToken().then(token => {
    //   token && Api.pushTokens.registerIOS(token);
    // });
    // FCM.on('refreshToken', (token) => {
    //   token && Api.pushTokens.registerIOS(token);
    // })
    // FCM.subscribeToTopic('/topics/all');
    //
    // Api.killSwitch().then(kill => {
    //   if( !kill ) return;
    //   this.setState({
    //     killed: true,
    //   })
    // }).catch(err => {
    //   // swallow error on kill switch
    //   console.log(err);
    // })
    //
    // CurrentUser.hasAcceptedTerms().then(yes => {
    //   if( yes ) return;
    //   this.setState({
    //     needsTerms: true,
    //   })
    // }).catch(err => {
    //   // swallow error on accepting terms
    //   console.log(err);
    // })
  }

  render() {
    return <Scratch />

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
