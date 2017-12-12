import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import GeoCoder from 'react-native-geocoder';

import LocationPin from './components/location-pin';
import LocationSearch from './components/location-search';
import ClassSelection from './components/class-selection';
import ConfirmationModal from './components/confirmation-modal';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      carLocations: [
        {
          rotation: 78,
          latitude: 37.78725,
          longitude: -122.4318,
        },
        {
          rotation: -10,
          latitude: 37.79015,
          longitude: -122.4318,
        },
        {
          rotation: 262,
          latitude: 37.78525,
          longitude: -122.4348,
        },
      ],
    };
    this.initialRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    };
  }

  componentDidMount() {
    this.onRegionChange(this.initialRegion);
  }

  onRegionChange = (region) => {
    this.setState({ position: null });
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(async () => {
      try {
        const res = await GeoCoder.geocodePosition({ lat: region.latitude, lng: region.longitude });
        this.setState({ position: res[0] });
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  }

  onBookingRequest = () => {
    this.handleOpenConfirmationModal();
  }

  handleOpenConfirmationModal = () => {
    this.setState({ confirmationModalVisible: true });
  }

  handleCloseConfirmationModal = () => {
    this.setState({ confirmationModalVisible: false });
  }

  render() {
    const { carLocations, position, confirmationModalVisible } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MapView style={styles.fullScreenMap} initialRegion={this.initialRegion} onRegionChange={this.onRegionChange}>
          {carLocations.map((carLocation, i) => (
            <MapView.Marker key={i} coordinate={carLocation}>
              <Animated.Image
                style={{ transform: [{ rotate: `${carLocation.rotation}deg` }] }}
                source={require('./assets/images/car.png')}
              />
              </MapView.Marker>
          ))}
        </MapView>
        <LocationSearch value={position && (position.feature || position.formattedAddress)}/>
        <LocationPin onPress={this.onBookingRequest} />
        <ClassSelection />
        <ConfirmationModal visible={confirmationModalVisible} onClose={this.handleCloseConfirmationModal}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fullScreenMap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
