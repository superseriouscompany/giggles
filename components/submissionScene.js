import React, { Component } from 'react';

import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  StatusBar,
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
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>
            Success!{"\n"}{"\n"}
            When should we show your{"\n"}
            photo?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={this._selectOne.bind(this)}>
            <View style={styles.uncheckedCircleContainer}>
              <Image source={require('../images/UncheckedGreyCircle.png')}/>
            </View>

            <View style={styles.leftInfoContainer}>
              <Image source={require('../images/ShuffleIcon.png')}/>
              <Text style={styles.shufflePrice}>
                $0.00
              </Text>
            </View>

            <View style={styles.rightInfoContainer}>
              <Text style={styles.imageCount}>
                369
              </Text>
              <Image style={styles.imagesIcon} source={require('../images/ImagesIcon.png')}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={this._selectTwo.bind(this)}>
            <View style={styles.uncheckedCircleContainer}>
              <Image source={require('../images/UncheckedGreyCircle.png')}/>
            </View>

            <View style={styles.leftInfoContainer}>
              <Image style={styles.instantIcon} source={require('../images/InstantIcon.png')}/>
              <Text style={styles.instantPrice}>
                $0.99
              </Text>
            </View>

            <View style={styles.rightInfoContainer}>
              <Text style={styles.now}>
                Now
              </Text>
            </View>
          </TouchableOpacity>
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
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 69,
    fontFamily: 'NotoSans',
  },
  optionsContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
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
  uncheckedCircleContainer: {
    padding: 18,
  },
  leftInfoContainer: {
    flex: 0.50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightInfoContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageCount: {
    marginRight: 8,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white',
  },
  imagesIcon: {
    marginRight: 18,
  },
  shufflePrice: {
    marginLeft: 10,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white',
  },
  instantIcon: {
    marginLeft: 5,
  },
  instantPrice: {
    marginLeft: 21,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white',
  },
  now: {
    marginRight: 27,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white'
  },
  bottomMiddle: {
    flex: .25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: .2,
  },
});

module.exports = SubmissionScene;
