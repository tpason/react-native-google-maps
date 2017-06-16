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
  TextInput,
  Button,
  Image,
  Alert,
  View,
} from 'react-native';
var {width} = Dimensions.get('window');
import MapView, { Marker } from 'react-native-maps';
// import * as Animatable from 'react-native-animatable';

class LocationButton extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={() => (
        this.props.moveMaptoLocation(this.props.marker.latLng)
      )}>
        <Text style={styles.animatedText}>
          {this.props.marker.title}
        </Text>
        {/*<Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center', fontSize: 15, color: '#FF0' }}>❤❤❤❤</Animatable.Text>*/}
      </TouchableOpacity>
    )
  }
}

class MapSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  render() {
    return (
      <View style={styles.container}>
          <View style={{padding: 10}}>
            <TextInput
              style={{height: 40}}
              placeholder="Type here!"
              onChangeText={(text) => this.setState({text})}
            />
            {/*<Text>*/}
              {/*{this.state.text}*/}
            {/*</Text>*/}
            <ButtonAddress text={this.state.text} />
          </View>
      </View>
    );
  }
}

class ButtonAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {json: '', addr: ''};
  }
  async onPressFindAutocomplete() {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/place/queryautocomplete/json?&types=geocode&key=AIzaSyAPQqDXR6mVZmUhh-4Q-xT31eTHlZy3264&input=' + this.props.text);
      let responseJson = await response.json();
      // console.warn(JSON.stringify(responseJson));
      this.setState({json: responseJson});
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    const {json} = this.state;
    // const {text} = this.state.text;
    return (
      <View>
        {/*<Button title="Find" onPress={(json) => { this.onPressFind(json && this.state.json) }} />*/}
        {json != '' && <AutoCompleteMap json={json}/>}
        <Button title="Find" onPress={() => this.onPressFindAutocomplete()} />
        {/*<Text>*/}
          {/*{json != '' ? console.warn(JSON.stringify(json.results)) : ''}*/}
        {/*</Text>*/}
        {/*{json != '' && json.results.map((result, key) => (*/}
        {/*<Text key={key}>*/}
          {/*formatted_address: {result.formatted_address}{'\n'}*/}
          {/*latitude: {result.geometry.location.lat}{'\n'}*/}
          {/*longitude: {result.geometry.location.lng}{'\n'}*/}
        {/*/!*Title: {movie.title}{'\n'}*!/*/}
        {/*</Text>*/}
        {/*))}*/}
        {/*<Text>*/}
          {/*{console.warn(JSON.stringify(this.state.json))}*/}
        {/*</Text>*/}
        {/*{json.results && json.results.address_components}*/}
      </View>
    );
  }
}
class AutoCompleteMap extends Component {
  constructor(props) {
    super(props);
    this.state = {addr: '', markers: ''};
    this.moveMaptoLocation = this.moveMaptoLocation.bind(this);
  }
  async onPressFind(addr) {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + addr);
      let responseJson = await response.json();
      this.setState({addr: responseJson});
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
  moveMaptoLocation(latLng) {
    // this.refs.map.animateToCoordinate({
    this.refs.map.animateToRegion({
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
      ...latLng,
    }, 2000);
  }
  render () {
    const {addr} = this.state;
    return (      
      <View>
        {this.props.json && this.props.json.predictions.map((address, key) => (
        <View key={key} >
          {/*<Text style={styles.address_row} onPress={() => this.onPressFind(address.description)} >*/}
          <Text style={styles.address_row} onPress={() => this.onPressFindPlaceId(address.place_id)} >
            {address.description}{'\n'}
          </Text>
        </View>
        ))}
          
        {addr != '' &&         
        <View>
          <Text>
            lat: {addr.result.geometry.location.lat}
            lng: {addr.result.geometry.location.lng}
            markerss: {JSON.stringify(this.state.markers)}
          </Text>
        </View>}
       
      </View>
    )
  }
}
export default class ReactMaps extends Component {
  constructor(props) {
    super(props);
    // 1 latitudeDelta => 110.57KM
    // 1 longitudeDelta => 111.32KM
    this.state = {
      json: '',
      text: '',
      // markers: [
      //   {latLng: {latitude: 10.7826155, longitude: 106.6937289},
      //     image: require('./assets/1.png'),
      //     photo: require('./assets/1.jpg'),
      //     title: 'Turtle Lake', description: 'Address: phường 6 District 3 Ho Chi Minh Vietnam'
      //   },
      //   {latLng: {latitude: 10.7705018, longitude: 106.7107223},
      //     image: require('./assets/2.png'),
      //     photo: require('./assets/2.jpg'),
      //     title: 'Hầm Thủ Thiêm', description: 'Address: Hầm Thủ Thiêm, Thủ Thiêm, Quận 2, Hồ Chí Minh, Vietnam'
      //   },
      //   {latLng: {latitude: 10.7747954, longitude: 106.7006779},
      //     image: require('./assets/3.png'),
      //     photo: require('./assets/3.jpg'),
      //     title: 'Phố đi bộ Nguyễn Huệ', description: 'Address: Nguyễn Huệ Bến Nghé Quận 1 Hồ Chí Minh, Vietnam'
      //   },
      //   {latLng: {latitude: 10.7683238, longitude: 106.7044472},
      //     image: require('./assets/4.png'),
      //     photo: require('./assets/4.jpg'),
      //     title: 'Ho Chi Minh Museum Bến Nhà Rồng', description: 'Address: 1 Nguyễn Tất Thành, phường 12, Quận 4, Hồ Chí Minh, Vietnam'
      //   }
      // ],
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
    this.moveMaptoLocation = this.moveMaptoLocation.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
  }
  async getMoviesFromApi() {
    try {
      let response = await fetch('https://facebook.github.io/react-native/movies.json');
      let responseJson = await response.json();
      // console.warn(JSON.stringify(responseJson.title));
      this.setState({json: responseJson})
    } catch(error) {
      console.error(error);
    }
  }
  onRegionChange(region) {
    this.setState({region})
  }
  searchAddress(text) {
    this.setState({text})
  }
  moveMaptoLocation(latLng) {
    // this.refs.map.animateToCoordinate({
    this.refs.map.animateToRegion({
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
      ...latLng,
    }, 2000);
}
  async componentDidMount () {
    await this.getMoviesFromApi();
  }
  
  funasd () {
    
  }

  render() {
    const { json } = this.state;
    // console.warn(JSON.stringify(json));
    let coordinates = this.state.markers.map(marker => marker.latLng);
    return (
      <View
        style={styles.container}>
        <LocationButton
          moveMaptoLocation={this.moveMaptoLocation}
          marker={this.state.markers}/>
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
          {/*<MapView.Circle */}
            {/*center={this.state.markers[2].latLng}*/}
            {/*radius={100}*/}
            {/*strokeWidth={2}*/}
            {/*strokeColor="#f00"*/}
            {/*zIndex={10}*/}
            {/*fillColor="#0f0a" />*/}
          {/*find address from a -> c*/}
          {/*<MapView.Polyline*/}
            {/*coordinates={coordinates}  */}
            {/*strokeWidth={2}*/}
            {/*strokeColor="#00F"*/}
          {/*/>*/}
          {/*<MapView.Polygon*/}
            {/*coordinates={coordinates}*/}
            {/*strokeWidth={2}*/}
            {/*strokeColor="#f00"*/}
            {/*fillColor="#0aaa"*/}
          {/*/>*/}
          
          {/*{this.state.markers.map((marker, key) => (*/}
            {/*<MapView.Marker*/}
              {/*draggable*/}
              {/*key={key}*/}
              {/*coordinate={marker.latLng}*/}
              {/*title={marker.title}*/}
              {/*description={marker.description}*/}
            {/*>*/}
              {/*<View style={styles.pin}>*/}
                {/*<Image style={styles.pinImage}*/}
                  {/*source={marker.image}*/}
                {/*/>*/}
                {/*<Text style={styles.pinText}>*/}
                  {/*{marker.title}*/}
                {/*</Text>                */}
              {/*</View>*/}
              {/*<MapView.Callout>*/}
                {/*<View style={styles.callout}>*/}
                  {/*<Image style={styles.calloutPhoto}*/}
                    {/*source={marker.photo}*/}
                  {/*/>*/}
                  {/*<Text style={styles.calloutTitle}>*/}
                    {/*{marker.title}*/}
                  {/*</Text>*/}
                  {/*<Text style={{textAlign: "center", color: '#FF397A', fontStyle: 'italic', fontWeight: 'bold'}}>*/}
                    {/*{marker.description}*/}
                  {/*</Text>*/}
                {/*</View>*/}
              {/*</MapView.Callout>*/}
            {/*</MapView.Marker>*/}
            {/*)            */}
          {/*)}*/}
        </MapView>
        <View 
        style={styles.message}>
          <MapSearch text={this.state.text} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
    textAlignVertical  : "center",
    textAlign  : "center", 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorRed: {
    color: 'rgba(255, 255, 0, 0.7)'
  },
  button: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: '#000',
    margin: 10
  },
  message: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // zIndex: 999 //hidden =.=
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
    color: '#00f'
  },
  callout: {
    flex: 1,
    paddingRight: 10,
    paddingBottom: 10,
    marginRight: 10,
    marginBottom: 10,
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
