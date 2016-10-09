import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Dimensions
} from 'react-native';

import CaptionScene from './components/captionScene';
import CaptionsScene from './components/captionsScene';

const routes = [
  { slug: 'caption' },
  { slug: 'captions'},
]

let flipped;

class RootNav extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Navigator
        initialRoute={routes[1]}
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
      case 'captions':
        return <CaptionsScene navigator={navigator}/>;
      case 'caption':
        return <CaptionScene navigator={navigator}/>;
    }
  }
}

AppRegistry.registerComponent('steffigraffiti', () => RootNav);
