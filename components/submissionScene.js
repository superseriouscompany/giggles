import React, { Component } from 'react';

import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SubmissionButton from './submissionButton';

const windowSize = Dimensions.get('window');

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.navigator = props.navigator;
  }

  _selectOne() {

  }

  _selectTwo() {

  }

  _submit() {

  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>
            Success!{"\n"}{"\n"}
            When should we show your{"\n"}
            photo?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionOne} onPress={this._selectOne.bind(this)}>
            <TouchableOpacity style={styles.uncheckedContainer}>
              <Image source={require('../images/UncheckedGreyCircle.png')}/>
            </TouchableOpacity>
            <Image source={require('../images/ShuffleIcon.png')}/>
            <Text style={{fontFamily: 'NotoSans', fontSize: 18, color: 'white'}}>
              $0.00
            </Text>
            <Text style={{fontFamily: 'NotoSans', fontSize: 18, color: 'white'}}>
              369
            </Text>
            <Image source={require('../images/ImagesIcon.png')}/>
          </View>

          <View style={styles.optionTwo} onPress={this._selectTwo.bind(this)}>
            <TouchableOpacity style={styles.uncheckedContainer}>
              <Image source={require('../images/UncheckedGreyCircle.png')}/>
            </TouchableOpacity>
            <Image source={require('../images/InstantIcon.png')}/>
            <Text style={{fontFamily: 'NotoSans', fontSize: 18, color: 'white'}}>
              $0.99
            </Text>
            <Text style={{fontFamily: 'NotoSans', fontSize: 18, color: 'white'}}>
              Now
            </Text>
          </View>
        </View>

        <View style={styles.bottomMiddle}>
          <TouchableOpacity onPress={this._submit.bind(this)}>
              <Image source={require('../images/Submit.png')} />
          </TouchableOpacity>
        </View>
      </View>


    )
  }

  enqueue() {
    Alert.alert('Added you to the queue', 'But you have no chance');
    this.navigator.navigate('CaptionScene');
  }
}

const styles = StyleSheet.create({
  debug: {
    backgroundColor: 'pink',
  },
  background: {
    flex: 1,
    backgroundColor: '#181818',
  },
  headerTextContainer: {
    flex: 0.25,
    backgroundColor: 'papayawhip',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 42,
    fontFamily: 'NotoSans',
  },
  optionsContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionOne: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 63,
    width: windowSize.width - 28,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 14,
    marginRight: 14,
    borderColor: '#4A4A4A',
    borderWidth: 1,
    borderRadius: 10,
  },
  uncheckedContainer: {
    height: 63,
    width: 63,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 63,
    width: windowSize.width - 28,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 14,
    marginRight: 14,
    borderColor: '#4A4A4A',
    borderWidth: 1,
    borderRadius: 10,
  },
  bottomMiddle: {
    flex: .25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'forestgreen',
  },
});

module.exports = SubmissionScene;
