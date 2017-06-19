/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ButtonFind from './ButtonFind';
var {width} = Dimensions.get('window');
export default class ReactMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: '',
      text: '',
      markers: [],
      region: {
        latitude: 10.865742,
        longitude: 106.8022934,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      },
      x: '',
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.findAutocomplete = this.findAutocomplete.bind(this);
    this.onPressFindPlaceId = this.onPressFindPlaceId.bind(this);
  }
  onRegionChange(region) {
    this.setState({region})
  }
  moveMaptoLocation(latLng) {
    this.refs.map.animateToRegion({
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
      ...latLng,
    }, 2000);
}
  async findAutocomplete(addr) {
    try {
      this.setState({text: addr});
      let response = await fetch('https://maps.googleapis.com/maps/api/place/queryautocomplete/json?&types=geocode&key=AIzaSyAPQqDXR6mVZmUhh-4Q-xT31eTHlZy3264&input=' + addr);
      let responseJson = await response.json();
      this.setState({json: responseJson});
    } catch(error) {
      console.error(error);
    }
  }
  async onPressFindPlaceId(place_id) {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?&key=AIzaSyAPQqDXR6mVZmUhh-4Q-xT31eTHlZy3264&placeid=' + place_id);
      let responseJson = await response.json();
      this.setState({addr: responseJson});
      const {addr} = this.state;
      this.setState({markers: [
        {latLng: {
          latitude: addr.result.geometry.location.lat,
          longitude: addr.result.geometry.location.lng},
          image: addr.result.icon,
          photo: 'https://s-media-cache-ak0.pinimg.com/736x/c6/37/f0/c637f060e0e549b01baf1fd781a75cb0.jpg',
          title: addr.result.formatted_address,
          description: addr.result.adr_address,
        },
      ]});
    } catch(error) {
      console.error(error);
    }
  }
  render() {
    const {json} = this.state;
    return (
      <View
        style={styles.container}>
        <MapView
          style={styles.container}
          ref="map"
          mapType="terrain"   //standard, satellite, hybrid, terrain
          region={this.state.region}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker
            coordinate={{
              latitude: 10.865742,
              longitude: 106.8022934,}}
          />
        </MapView>
        <ButtonFind findAutocomplete={this.findAutocomplete} />
        <View>
          {json != '' && json.predictions.map((address, key) => (
            <View key={key} >
              {/*<Text style={styles.address_row} onPress={() => this.onPressFind(address.description)} >*/}
              <Text style={styles.address_row} onPress={() => this.onPressFindPlaceId(address.place_id)} >
                {address.description}{'\n'}
              </Text>
            </View>
          ))}
        </View>
        {this.state.markers != '' &&
          <View style={styles.click_autocomplete}>
            <Text>
              {JSON.stringify(this.state.markers)}
            </Text>
          </View>
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    width: width,
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  address_row: {
    backgroundColor: '#FF0',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10,
    marginBottom: 5,
  },
  click_autocomplete: {
    backgroundColor: '#FFF',
    padding: 10,
  }
});

AppRegistry.registerComponent('ReactMaps', () => ReactMaps);
