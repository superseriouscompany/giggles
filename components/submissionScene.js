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

import PoopButton from './poopButton';

import SubmissionButton from './submissionButton';

const windowSize = Dimensions.get('window');

class SubmissionScene extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.navigator = props.navigator;
  }

  _selectFree() {
    this.setState({selection: 'free'});
  }

  _selectPaid() {
    this.setState({selection: 'paid'});
  }

  _submit() {
    if( this.state.selection == 'paid' ) {
      Alert.alert('Paid');
    } else if( this.state.selection == 'free' ) {
      this.navigator.navigate('CaptionScene');
      Alert.alert('Added you to the queue', 'But you have no chance');
    } else {
      console.error("Unknown state", this.state.selection);
    }
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
          <View>
            { this.state.selection == 'free' ?
              <View style={styles.optionSelected}>

                <View style={styles.leftCheckmarkContainer}>
                  <Image style={styles.whiteCheckmark} source={require('../images/whiteCheckmark.png')} />
                </View>

                <View style={styles.selectedInfoContainer}>
                  <View style={styles.selectedTopRowContainer}>
                    <View style={styles.leftInfoContainer}>
                      <Image source={require('../images/ShuffleGreenBackground.png')}/>
                      <Text style={styles.shufflePrice}>
                        $0.00
                      </Text>
                    </View>

                    <View style={styles.rightInfoContainer}>
                      <Text style={styles.imageCount}>
                        {this.props.queueSize}
                      </Text>
                      <Image style={styles.imagesIcon} source={require('../images/ImagesIcon.png')}/>
                    </View>
                  </View>

                  <View style={styles.selectedDescriptionContainer}>
                    <Text style={styles.selectedDescription}>
                      Throw it in the pile.
                      One photo is randomly selected from here everyday.
                      There are currently {this.props.queueSize} photos hoping to get picked.
                    </Text>
                  </View>
                </View>
              </View>
            :
              <TouchableOpacity style={styles.option} onPress={this._selectFree.bind(this)}>
                <View style={styles.uncheckedCircleContainer}>
                  <Image source={require('../images/UncheckedGreyCircle.png')}/>
                </View>

                <View style={styles.leftInfoContainer}>
                  <Image source={require('../images/ShuffleGreyBackground.png')}/>
                  <Text style={styles.shufflePrice}>
                    $0.00
                  </Text>
                </View>

                <View style={styles.rightInfoContainer}>
                  <Text style={styles.imageCount}>
                    {this.props.queueSize}
                  </Text>
                  <Image style={styles.imagesIcon} source={require('../images/ImagesIcon.png')}/>
                </View>
              </TouchableOpacity>
            }

            { this.state.selection == 'paid' ?
              <View style={styles.optionSelected}>
                <View style={styles.leftCheckmarkContainer}>
                  <Image style={styles.whiteCheckmark} source={require('../images/whiteCheckmark.png')} />
                </View>

                <View style={styles.selectedInfoContainer}>
                  <View style={styles.selectedTopRowContainer}>
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
                  </View>

                  <View style={styles.selectedDescriptionContainer}>
                    <Text style={styles.selectedDescription}>
                      If you don't want to wait, you can pay us a few cents and we'll
                      immediately replace the current photo with yours.
                    </Text>
                  </View>
                </View>
              </View>
            :
              <TouchableOpacity style={styles.option} onPress={this._selectPaid.bind(this)}>
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
            }
          </View>
        </View>

        <View style={[styles.bottomMiddle, {opacity: this.state.selection ? 1 : 0.2}]}>
          <PoopButton active={!!this.state.selection} onPress={this._submit.bind(this)} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#181818',
  },
  headerTextContainer: {
    flex: 0.27,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 66.6,
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
    fontWeight: 'bold',
  },
  instantIcon: {
    marginLeft: 5,
  },
  instantPrice: {
    marginLeft: 20.69,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  now: {
    marginRight: 27,
    fontFamily: 'NotoSans',
    fontSize: 18,
    color: 'white'
  },
  bottomMiddle: {
    flex: .23,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 173,
    width: windowSize.width - 28,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 14,
    marginRight: 14,
    borderColor: '#4A4A4A',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#4BBB7F',
  },
  leftCheckmarkContainer: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 2,
  },
  selectedInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 173,
  },
  selectedTopRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 63,
  },
  selectedDescription: {
    fontFamily: 'NotoSans',
    fontSize: 16,
    color: 'white',
    marginTop: -5,
  },
});

module.exports = SubmissionScene;
