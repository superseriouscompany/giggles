'use strict';

import React, {Component} from 'react';
import FCM from 'react-native-fcm';
import {
  Text,
  View,
} from 'react-native';

export default class Scratch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: 'unknown...'
    }

    FCM.requestPermissions();
    FCM.getFCMToken().then( (token) => {
      if( !token ) { return console.warn("No firebase token available."); }
      this.setToken(token);
    });
    FCM.on('refreshToken', (token) => {
      if( !token ) { return console.warn("No firebase token on refresh."); }
      this.setToken(token);
    })
  }

  setToken(token) {
    this.setState({
      token: token,
    })
    FCM.subscribeToTopic('/topics/foo');

    return fetch(`https://superserious.ngrok.io/v1/users`, {
      method: 'POST',
      body: JSON.stringify({facebook_access_token: token, app: 'floats'}),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(function(response) {
      alert('cool');
    }).catch(function(err) {
      alert(err);
    })
  }

  render() { return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{this.state.token} {this.state.refreshed ? '(refreshed)' : ''}</Text>
    </View>
  )}
}
