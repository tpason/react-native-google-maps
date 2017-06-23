/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
var {width} = Dimensions.get('window');
export default class NearlyLocation extends Component {

  render() {
    return (
      <View style={styles.nearlyLocation}>
        <Text>
          {JSON.stringify(this.props.nearlyLocation)}
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  nearlyLocation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
module.exports = NearlyLocation;
