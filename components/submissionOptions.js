import React, {Component} from 'react';

import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class SubmissionOptions extends Component {
  state = {}

  _selectFree() {
    this.setState({selection: 'free'});
  }

  _selectPaid() {
    this.setState({selection: 'paid'});
  }

  render() {
    const product = this.props.products && this.props.products[0];
    return (
      <View style={styles.background}>
        <StatusBar backgroundColor="#181818" barStyle="light-content"/>
          { !product ?
            <ActivityIndicator
              style={[styles.centering, {transform: [{scale: 1.5}]}]}
              size="small"
              color="ghostwhite"
            />
          :
            <View style={styles.background}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  Success!{"\n"}{"\n"}
                  When should we show your{"\n"}
                  photo?
                </Text>
              </View>

              <View style={styles.optionsContainer}>
                  {this.options(product)}
              </View>

              <View style={[styles.bottomMiddle, {opacity: this.state.selection ? 1 : 0.2}]}>
                <TouchableOpacity style={{opacity: this.props.purchasing ? 1 : 0.2}} onPress={() => this.props.onPress(this.state.selection)}>
                  <Image source={require('../images/Submit.png')} />
                </TouchableOpacity>
              </View>
            </View>
          }
      </View>
    )
  }

  options(product) { return(
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
                  {this.props.queueSize || 0}
                </Text>
                <Image style={styles.imagesIcon} source={require('../images/ImagesIcon.png')}/>
              </View>
            </View>

            <View style={styles.selectedDescriptionContainer}>
              <Text style={styles.selectedDescription}>
                Throw it in the pile.
                There are currently {this.props.queueSize || 0} photos hoping to get chosen in the daily draw.
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
              {this.props.queueSize || 0}
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
                  {product.priceString}
                </Text>
              </View>

              <View style={styles.rightInfoContainer}>
                <Text style={styles.now}>
                  {product.title}
                </Text>
              </View>
            </View>

            <View style={styles.selectedDescriptionContainer}>
              <Text style={styles.selectedDescription}>
                {/*{product.description}*/}
                Pay us a few cents, and we'll immediately replace the current photo with yours.
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
              {product.priceString}
            </Text>
          </View>

          <View style={styles.rightInfoContainer}>
            <Text style={styles.now}>
              {product.title}
            </Text>
          </View>
        </TouchableOpacity>
      }
    </View>
  )}
}

const windowSize = Dimensions.get('window');
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#181818',
  },
  centering: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: windowSize.width,
    height: windowSize.height,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    marginRight: 20,
  },
});
