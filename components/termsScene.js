import React, {Component} from 'react';

import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CurrentUser from '../lib/currentUser';

export default class TermsScene extends Component {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'mediumorchid', padding: 20 }}>
        { this.state.bye ?
          <Text style={{color: 'slategray'}}>
            Bye Felicia
          </Text>
        :
          <View>
            <Text style={{color: 'antiquewhite'}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            <Text style={{color: 'antiquewhite'}}>{"\n\n"}Accept the terms, motherfucker.{"\n\n"}</Text>

            <TouchableOpacity onPress={this.acceptTerms.bind(this)}>
              <Text style={{color: 'mediumaquamarine'}}>Ugh, fine.</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.setState({bye: true})}>
              <Text style={{color: 'firebrick'}}>Nah, I'm good.</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }

  acceptTerms() {
    CurrentUser.acceptTerms().then(() => {
      // TODO: hacky way to get parent view to clear terms
      this.navigator.navigate('CaptionScene', {clearTerms: true});
    }).catch(function(err) {
      Alert.alert("Sorry, something went wrong.")
    })
  }
}
