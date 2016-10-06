import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

const styles = StyleSheet.create({
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
  { title: 'Home', index: 0 },
  { title: 'Record Audio', index: 1 },
  { title: 'Camera', index: 2 },
  { title: 'Cool', index: 3 }
]

let flipped;

class RootNav extends Component {
  constructor(props) {
    super(props);
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

  render = () => {
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={(route, navigator) => {
          console.log("Rendering scene", route.index);
          return (
            <Text onPress={() => {
              this.nextPage(route, navigator);
            }}>
              Sup {route.title}
            </Text>
          )
        }}
        style={{padding: 100}}
      />
    )
  }
}

AppRegistry.registerComponent('AwesomeProject', () => RootNav);
