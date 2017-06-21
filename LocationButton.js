/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
export default class LocationButton extends Component {

  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={() => (
        this.props.moveMaptoLocation(this.props.marker.latLng)
      )}>
        <Text style={styles.animatedText}>
          {this.props.marker.title}
        </Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: '#000',
    margin: 10
  },
  animatedText: {
    textAlign: "center",
    color: '#FF397A',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
});
module.exports = LocationButton;
