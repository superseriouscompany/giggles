import React, { Component } from 'react';
import MemeScene from './components/memeScene';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

const styles = StyleSheet.create({
  fullScreen: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

const routes = [
  { title: 'Home', slug: 'home', index: 0 },
  { title: 'Record Audio', slug: 'recordAudio', index: 1 },
  { title: 'Camera', slug: 'camera', index: 2 },
  { title: 'Cool', slug: 'cool', index: 3 }
]

let flipped;

class RootNav extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={this.renderScene}
        style={{padding: 100}}
      />
    )
  }

  renderScene = (route, navigator) => {
    return (
      <MemeScene></MemeScene>
    )

    return (
      <Text onPress={() => {
        this.nextPage(route, navigator);
      }}>
        Sup {route.title}
      </Text>
    )
  }

  nextPage = (route, navigator) => {
    if( route.index === 0 ) {
      flipped = false;
    } else if( route.index === 3 ) {
      flipped = true;
    }
    if( flipped ) {
      navigator.pop();
    } else {
      navigator.push(routes[route.index+1]);
    }
  }
}

AppRegistry.registerComponent('AwesomeProject', () => RootNav);
