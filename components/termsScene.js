import React, {Component} from 'react';

import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CurrentUser from '../lib/currentUser';

const windowSize = Dimensions.get('window');

export default class TermsScene extends Component {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#181818'}}>
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>
        { this.state.bye ?
          <Text style={{color: 'slategray'}}>
            Bye Felicia
          </Text>
        :
          <View style = {styles.background}>
            <View style={styles.termsContainer}>
              <Text style={styles.terms}>
                As a condition of use, you promise not to post any objectionable content to Giggles.
                This is a place of giggling, not of being mean.
                Content found objectionable by others will be reported and removed.{"\n"}{"\n"}
                Also, no nudity; we don't care if it's "a beautiful thing" ಠ_ಠ
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.accept} onPress={this.acceptTerms.bind(this)}>
                <Text style={styles.acceptText}>Accept Terms</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reject} onPress={() => this.setState({bye: true})}>
                <Text style={styles.rejectText}>Reject Terms</Text>
              </TouchableOpacity>
            </View>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  termsContainer: {
    width: windowSize.width * 0.8,
    height: windowSize.height * 0.666,
    paddingTop: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terms: {
    fontFamily: 'NotoSans',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',

  },
  optionsContainer: {
    height: windowSize.height * 0.333,
    width: windowSize.width,
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  accept: {
    width: windowSize.width * 0.666,
    marginTop: 70,
    padding: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
  reject: {
    width: windowSize.width * 0.666,
    marginTop: 5,
    padding: 10,
    paddingBottom: 12,
  },
  acceptText: {
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  rejectText: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});
