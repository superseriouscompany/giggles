import React, { Component } from 'react';
import {
  View,
  Text,
  CameraRoll
} from 'react-native'

class Cool extends Component  {
  constructor(props) {
    super(props);
    this.navigator = props.navigator;
    this.state = {};
  }

  render = () => {
    return (
      <View style={{paddingTop: 20, paddingLeft: 20}}>
        <Text onPress={this.press.bind(this)}>Cool {this.state.nice}</Text>
      </View>
    )
  }

  press = () => {
    this._randomPhoto().then(function(photo) {
      console.log("got photo", photo);
      var body = new FormData();
      body.append('cool', 'nice');
      body.append('good', 'great');
      body.append('photo', {...photo, name: 'photo.jpg'});

      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = (e) => {
        if( xhr.readyState !== 4 ) { return; }

        console.log(xhr.status, xhr.responseText);
      }
      xhr.open('POST', 'https://bf9083e7.ngrok.io/foo');
      xhr.send(body);
    })
  }

  _randomPhoto = () => {
    return CameraRoll.getPhotos(
      {first: 20}
    ).then(
      (data) => {
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          return randomPhoto;
        }
      },
      (error) => undefined
    );
  }
}

module.exports = Cool
