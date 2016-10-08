import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Dimensions
} from 'react-native';

class steffigraffiti extends Component {
  render = () => {
    return (
      <Text>Sup</Text>
    )
  }
}

import {
  MemeScene,
  SourceScene,
  CameraScene,
  CoolScene
} from './components/scenes';

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
        style={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width
        }}
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

AppRegistry.registerComponent('steffigraffiti', () => RootNav);
