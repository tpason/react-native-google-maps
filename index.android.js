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
  Image,
  View,
} from 'react-native';
var {width} = Dimensions.get('window');
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';

export default class ReactMaps extends Component {
  constructor(props) {
    super(props);
    // 1 latitudeDelta => 110.57KM
    // 1 longitudeDelta => 111.32KM
    this.state = {
      markers: [
        {latLng: {latitude: 10.7880448, longitude: 106.683055},
          image: require('./assets/1.png'),
          photo: require('./assets/1.jpg'),
          title: 'Kirigaya Kazuto', description: 'I know you have a crush on Kazuto-kun~'
        },
        {latLng: {latitude: 10.7810449, longitude: 106.685025},
          image: require('./assets/2.png'),
          photo: require('./assets/2.jpg'),
          title: 'Yukii Asuna', description: 'You can get married!'
        },
        {latLng: {latitude: 10.7860542, longitude: 106.687015},
          image: require('./assets/3.png'),
          photo: require('./assets/3.jpg'),
          title: 'Lisbeth', description: 'Kirito-kun, Watashi wa daisuki ... =.='
        }
      ],
      region: {
        latitude: 10.7880448,
        longitude: 106.683055,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      },
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }
  onRegionChange(region) {
    this.setState({region})
  }
  render() {
    let coordinates = this.state.markers.map(marker => marker.latLng);
    return (
      <View
        style={styles.container}>
        <MapView
          style={styles.container}
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
          <Text
            style={styles.text}>
            latitude: <Text style={styles.colorRed}>{this.state.region.latitude}{'\n'}</Text>
            longitude: <Text style={styles.colorRed}>{this.state.region.longitude}{'\n'}</Text>
            latitudeDelta: <Text style={styles.colorRed}>{this.state.region.latitudeDelta}{'\n'}</Text>
            longitudeDelta: <Text style={styles.colorRed}>{this.state.region.longitudeDelta}{'\n'}</Text>
          </Text>
          <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center', fontSize: 15, color: '#FF0' }}>Kowaii ❤❤❤❤️</Animatable.Text>
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
    color: 'rgba(255, 0, 0, 0.7)'
  },
  message: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 100,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  pin: {
    backgroundColor: 'rgba(51, 52, 52, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
    padding: 5,
    borderRadius: 16,
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
