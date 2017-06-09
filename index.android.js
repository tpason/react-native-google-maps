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
    this.state = {json: ''};
  }
  async onPressFind() {
    try {
      let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.props.text);
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
        <Button title="Find" onPress={() => this.onPressFind()} />
        {/*<Text>*/}
          {/*{json != '' ? console.warn(JSON.stringify(json.results)) : ''}*/}
        {/*</Text>*/}
        {json != '' && json.results.map((result, key) => (
        <Text key={key}>
          latitude: {result.geometry.location.lat}{'\n'}
          longitude: {result.geometry.location.lng}{'\n'}
        {/*Title: {movie.title}{'\n'}*/}
        </Text>
        ))}
        {/*<Text>*/}
          {/*{console.warn(JSON.stringify(this.state.json))}*/}
        {/*</Text>*/}
        {/*{json.results && json.results.address_components}*/}
      </View>
    );
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
      markers: [
        {latLng: {latitude: 10.7826155, longitude: 106.6937289},
          image: require('./assets/1.png'),
          photo: require('./assets/1.jpg'),
          title: 'Turtle Lake', description: 'Address: phường 6 District 3 Ho Chi Minh Vietnam'
        },
        {latLng: {latitude: 10.7705018, longitude: 106.7107223},
          image: require('./assets/2.png'),
          photo: require('./assets/2.jpg'),
          title: 'Hầm Thủ Thiêm', description: 'Address: Hầm Thủ Thiêm, Thủ Thiêm, Quận 2, Hồ Chí Minh, Vietnam'
        },
        {latLng: {latitude: 10.7747954, longitude: 106.7006779},
          image: require('./assets/3.png'),
          photo: require('./assets/3.jpg'),
          title: 'Phố đi bộ Nguyễn Huệ', description: 'Address: Nguyễn Huệ Bến Nghé Quận 1 Hồ Chí Minh, Vietnam'
        },
        {latLng: {latitude: 10.7683238, longitude: 106.7044472},
          image: require('./assets/4.png'),
          photo: require('./assets/4.jpg'),
          title: 'Ho Chi Minh Museum Bến Nhà Rồng', description: 'Address: 1 Nguyễn Tất Thành, phường 12, Quận 4, Hồ Chí Minh, Vietnam'
        }
      ],
      region: {
        latitude: 10.7826155,
        longitude: 106.6937289,
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
    // this.setState({
    //   region: {
    //     latitudeDelta: 0.002,
    //     longitudeDelta: 0.002,
    //     ...latLng,
    //   }
    // })
}
  async componentDidMount () {
    await this.getMoviesFromApi();
  }

  render() {
    const { json } = this.state;
    // console.warn(JSON.stringify(json));
    let coordinates = this.state.markers.map(marker => marker.latLng);
    return (
      <View
        style={styles.container}>
        {this.state.markers.map((marker, key) => (
          <LocationButton key={key}
            moveMaptoLocation={this.moveMaptoLocation}
            marker={marker}/>
        ))}
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
          <MapView.Circle 
            center={this.state.markers[2].latLng}
            radius={100}
            strokeWidth={2}
            strokeColor="#f00"
            zIndex={10}
            fillColor="#0f0a" />
          {/*find address from a -> c*/}
          <MapView.Polyline
            coordinates={coordinates}  
            strokeWidth={2}
            strokeColor="#00F"
          />
          {/*<MapView.Polygon*/}
            {/*coordinates={coordinates}*/}
            {/*strokeWidth={2}*/}
            {/*strokeColor="#f00"*/}
            {/*fillColor="#0aaa"*/}
          {/*/>*/}
          
          {this.state.markers.map((marker, key) => (
            <MapView.Marker
              draggable
              key={key}
              coordinate={marker.latLng}
              title={marker.title}
              description={marker.description}
            >
              <View style={styles.pin}>
                <Image style={styles.pinImage}
                  source={marker.image}
                />
                <Text style={styles.pinText}>
                  {marker.title}
                </Text>                
              </View>
              <MapView.Callout>
                <View style={styles.callout}>
                  <Image style={styles.calloutPhoto}
                    source={marker.photo}
                  />
                  <Text style={styles.calloutTitle}>
                    {marker.title}
                  </Text>
                  <Text style={{textAlign: "center", color: '#FF397A', fontStyle: 'italic', fontWeight: 'bold'}}>
                    {marker.description}
                  </Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
            )            
          )}
        </MapView>
        <View 
        style={styles.message}>
          <MapSearch text={this.state.text} />
          <Text
            style={styles.text}>
            {/*latitude: <Text style={styles.colorRed}>{this.state.region.latitude}{'\n'}</Text>*/}
            {/*longitude: <Text style={styles.colorRed}>{this.state.region.longitude}{'\n'}</Text>*/}
            {/*latitudeDelta: <Text style={styles.colorRed}>{this.state.region.latitudeDelta}{'\n'}</Text>*/}
            {/*longitudeDelta: <Text style={styles.colorRed}>{this.state.region.longitudeDelta}{'\n'}</Text>*/}
            {/*<Text style={styles.colorRed}>1 latitudeDelta => 110.57 km{'\n'}</Text>*/}
            {/*<Text style={styles.colorRed}>1 longitudeDelta => 111.32 km{'\n'}</Text>*/}
            {/*<Text>{this.state.json.description}</Text>*/}
            
            {/*{json && json.movies.map((movie, key) => (*/}
              {/*<Text key={key}>*/}
                {/*Key: {key}{'\n'}*/}
                {/*Title: {movie.title}{'\n'}*/}
                {/*releaseYear: {movie.releaseYear}{'\n'}*/}
              {/*</Text>*/}
            {/*))}*/}
          </Text>
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
    // zIndex: -999 //hidden =.=
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
