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
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Picker,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ButtonFind from './ButtonFind';
import NearlyLocation from './NearlyLocation';
import {debounce} from 'throttle-debounce';
var {width} = Dimensions.get('window');
export default class ReactMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      json: '',
      text: '',
      type: 'address',
      latLng: '',
      region : {
        latitude: 10.865742,
        longitude: 106.8022934,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      },
      x: '',
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.findAutocomplete = debounce(500, this.findAutocomplete.bind(this));
    this.onPressFindPlaceId = this.onPressFindPlaceId.bind(this);
    this.selectType = this.selectType.bind(this);
  }
  onRegionChange(region) {
    this.setState({region})
  }
  async findAutocomplete(addr) {
    try {
      this.setState({text: addr});
      let response = await fetch('https://maps.googleapis.com/maps/api/place/queryautocomplete/json?&types=geocode&key=AIzaSyDSjdOEeRiP-P9egmnNyRJsHxCiC2h21qc&input=' + addr);
      let responseJson = await response.json();
      this.setState({json: responseJson});
      this.setState({show: true});
    } catch(error) {
      console.error(error);
    }
  }
  async onPressFindPlaceId(place_id) {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?&key=AIzaSyDSjdOEeRiP-P9egmnNyRJsHxCiC2h21qc&placeid=' + place_id);
      let responseJson = await response.json();
      this.setState({addr: responseJson});
      const {addr} = this.state;
      addr && this.setState({
        latLng: {
          latitude: addr.result.geometry.location.lat,
          longitude: addr.result.geometry.location.lng},
        location: addr.result.geometry.location.lat+','+addr.result.geometry.location.lng,
        image: addr.result.icon,
        photos: addr.result.photos,
        title: addr.result.formatted_address,
        description: addr.result.adr_address,
        formatted_address: addr.result.formatted_address,
        names: addr.result.name,
      });
      addr && this.setState({show: false});
      // addr && console.warn(JSON.stringify(this.state.photos));
      this.refs.map.animateToRegion({
        latitudeDelta: 0.0052,
        longitudeDelta: 0.0052,
        ...this.state.latLng,
      }, 5000);
    } catch(error) {
      console.error(error);
    }
  }
  async selectType(type, location) {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/place/radarsearch/json?&radius=5000&key=AIzaSyDSjdOEeRiP-P9egmnNyRJsHxCiC2h21qc&placeid=ChIJd-F-9hasNTERd_YLTMfIL0Q&type=' + type + '&location='+location);
      let responseJson = await response.json();
      this.setState({nearlyLocation: responseJson});
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
          liteMode={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker.Animated
            coordinate={{
              latitude: 10.865742,
              longitude: 106.8022934,}}
          />
          {this.state.latLng != '' &&
          <View>
            <MapView.Circle
              center={this.state.latLng}
              radius={100}
              strokeWidth={2}
              strokeColor="#f00"
              lineCap="round"
              geodesic={true}
              zIndex={10}
              fillColor="rgba(255, 0, 0, 0.2)" />
            <MapView.Marker.Animated
              draggable
              coordinate={this.state.latLng}
              title={this.state.title}
              description={this.state.description}
            >
              <View style={styles.pin}>
                <Text style={styles.pinText}>
                  {this.state.title}
                </Text>
                <Image style={styles.pinImage}
                  source={{uri: 'https://i.stack.imgur.com/NgrnX.png'}}
                />
              </View>
              <MapView.Callout>
                <View style={styles.callout}>
                  {/*{this.state.photos !== undefined  && this.state.photos.map((photo, key) => (*/}
                    {/*<View key={key} >*/}
                      {/*<Image style={{width: photo.width, height: photo.height}}*/}
                        {/*source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII='}}*/}
                      {/*/>*/}
                    {/*</View>*/}
                  {/*))}*/}
                  
                  <Text style={styles.calloutTitle}>
                    {this.state.title}
                  </Text>
                  <Text style={{textAlign: "center", color: '#FF397A', fontStyle: 'italic', fontWeight: 'bold'}}>
                    Name: {this.state.names}{'\n'}
                    Address: {this.state.formatted_address}
                  </Text>
                </View>
              </MapView.Callout>
            </MapView.Marker.Animated >
          </View>}
            
        </MapView>
        <ButtonFind findAutocomplete={this.findAutocomplete} />
        <View>
            {this.state.show && json != '' && json.predictions.map((address, key) => (
                <View key={key} >
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.address_row} onPress={() => this.onPressFindPlaceId(address.place_id)} >
                      {address.description}{'\n'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

          {!this.state.show &&
            <Picker
              selectedValue={this.state.type}
              onValueChange={(itemValue, itemIndex) => this.selectType(itemValue, this.state.location)}>
              <Picker.Item label="Airport" value="airport" />
              <Picker.Item label="ATM" value="atm" />
              <Picker.Item label="Bakery" value="bakery" />
              <Picker.Item label="Bank" value="bank" />
              <Picker.Item label="Bus station" value="bus_station" />
              <Picker.Item label="Cafe" value="cafe" />
              <Picker.Item label="Parking" value="parking" />
              <Picker.Item label="Food" value="food" />
              <Picker.Item label="GYM" value="gym" />
              <Picker.Item label="Hair care" value="hair_care" />
              <Picker.Item label="Zoo" value="zoo" />
              <Picker.Item label="University" value="university" />
              <Picker.Item label="Address" value="address" />
            </Picker>
          }
          
          {this.state.nearlyLocation &&
            <NearlyLocation nearlyLocation={this.state.nearlyLocation} />            
          }
        </View>
        
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
  },
  pin: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  pinImage: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    color: '#FF397A'
  },
  callout: {
    flex: 1,
    paddingRight: 10,
    paddingBottom: 10,
    marginRight: 10,
    marginBottom: 10,
    width: width
  },
  animatedText: {
    textAlign: "center",
    color: '#FF397A',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  address_row: {
    backgroundColor: '#FF0',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10,
    marginBottom: 5,
  },
  calloutPhoto: {
    flex: 1,
    width: 166,
    height: 163,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    textAlign  : "center",
  }
});

AppRegistry.registerComponent('ReactMaps', () => ReactMaps);
