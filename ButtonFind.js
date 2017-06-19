/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  TextInput,
  View,
} from 'react-native';
export default class ButtonFind extends Component {

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here!"
          onChangeText={(text) => this.props.findAutocomplete(text)}
        />
      </View>
    );
  }
}

module.exports = ButtonFind;
