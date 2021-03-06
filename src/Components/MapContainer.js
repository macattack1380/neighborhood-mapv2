import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {
  state = {
    bounds: {},
    selectedPlace: {},
    img: '',
    activeMarker: {},
    showingInfoWindow: true,
    center: {}
  };

  componentDidMount() {
    this.setBounds();
    this.setState({ center: this.props.centerCoords.location })
  }

  // Set map boundaries
  setBounds = () => {
    const bounds = new this.props.google.maps.LatLngBounds();
    for (let place of this.props.places) {
      bounds.extend(place.location);
    }
    this.setState({ bounds });
  }

  // InfoWindow on marker click
  onMarkerClick = (props, marker) => {
    const place = this.props.places.filter((place) => place.name === props.title)
    this.setState({
      showingInfoWindow: true,
      activeMarker: marker,
      selectedPlace: place[0],
    });
  }

  render() {
    const mapStyle = {
      width: '100%',
      height: '100%'
    };
    
    //check for FourSquare API Availability - request available
    console.log(this.props.requestAvailable)

    //render the map using Google API, also poll FourSquare if available, if not display error 'try again later'
    return (
      <div>
        <Map 
          google={this.props.google} 
          zoom={14} 
          style={mapStyle} 
          center={this.state.center}
          bounds={this.state.bounds}
        >
          {this.props.places.map((place, index) => 
            <Marker 
              key={index}
              name={place.name}
              title={place.name}
              position={{lat: place.location.lat, lng: place.location.lng}}
              onClick={this.onMarkerClick}
              animation={this.state.activeMarker.name === place.name &&this.props.google.maps.Animation.BOUNCE}
            />
          )}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
          
            { !this.props.requestAvailable ? (
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
                <h3>{this.state.selectedPlace.popular}</h3>
                <h3>Exceeded FourSquare API limit, please try again later.</h3>
              </div>
            ) : (
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
                <h3>{this.state.selectedPlace.popular}</h3>
                <img src={this.state.selectedPlace.photos} alt={this.state.selectedPlace.name}/>

              </div>
            )
          }
          </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBVuYwtERyg82CFa4CH_NmIOlPBZBMxsfs'
})(MapContainer);
