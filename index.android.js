import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  View
} from 'react-native';

import CaptionScene     from './components/captionScene';
import CaptionsScene    from './components/captionsScene';
import SubmissionsScene from './components/submissionsScene';
import SubmissionScene  from './components/submissionScene';
import NoScene          from './components/noScene';

class RootNav extends Component {
  constructor(props) {
    super(props);
    this.state = { scene: 'CaptionScene' }

    this.navigator = {
      navigate: (component) => {
        console.log("setting scene to", component);
        this.setState({scene: component})
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {
          this.state.scene == 'CaptionScene' ?
            <CaptionScene navigator={this.navigator} />
          : this.state.scene == 'CaptionsScene' ?
            <CaptionsScene navigator={this.navigator} />
          : this.state.scene == 'SubmissionsScene' ?
            <SubmissionsScene navigator={this.navigator} />
          : this.state.scene == 'SubmissionScene' ?
            <SubmissionScene navigator={this.navigator} />
          :
            <NoScene />
        }
      </View>
    )
  }
}

AppRegistry.registerComponent('steffigraffiti', () => RootNav);
