import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import {
  MemeScene,
  SourceScene,
  CameraScene,
  CoolScene
} from './components/scenes';

const styles = StyleSheet.create({
  fullScreen: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  padded: { padding: 100 },
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
  { slug: 'source', index: 0 },
  { slug: 'meme', index: 1 },
  { slug: 'camera', index: 2 },
  { slug: 'cool', index: 3 }
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
        style={[styles.fullScreen, styles.padded]}
      />
    )
  }

  renderScene = (route, navigator) => {
    // TODO: don't attach this to navigator multiple times
    navigator.navigate = function(slug) {
      let route = routes.find(function(r) { return r.slug === slug });
      if( !route ) return console.error("No route found matching", slug, "available routes: ", routes.map(function(r) { return r.slug}));
      navigator.push(route);
    }

    switch(route.slug) {
      case 'source':
        return <SourceScene navigator={navigator} onPress={this.nextPage}/>;
      case 'meme':
        return <MemeScene navigator={navigator} onPress={this.nextPage}/>;
      case 'camera':
        return <CameraScene navigator={navigator} onPress={this.nextPage}/>;
      case 'cool':
        return <CoolScene navigator={navigator} onPress={this.nextPage}/ >;
    }
  }
}

AppRegistry.registerComponent('AwesomeProject', () => RootNav);
