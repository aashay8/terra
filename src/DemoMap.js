import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper, DirectionsRenderer } from 'google-maps-react';

class DemoMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            endPoints: [],
            directions: null,
            centre: {
                lat: 28.5355,
                lng: 77.3910
            }
        }
    }

    //Checking if the Google API is available
    componentDidUpdate(prevProps, prevState) {
        //Props changed - Thus component updated
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
    }

    componentDidMount() {
        const success = position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            this.setState({
                centre: {
                    lat: latitude,
                    lng: longitude
                }
            });
        };

        const error = () => {
            console.log('Unable to get real time location')
            this.setState({
                centre: {
                    lat: 28.5355,
                    lng: 77.3910
                }
            });
        };

        navigator.geolocation.getCurrentPosition(success, error);

        this.loadMap();
    }

    loadMap() {
        if (this.props && this.props.google) {
            // google is available
            const { google } = this.props;
            const maps = google.maps;
        }
    }

    onClickPlaceMarker = (lat, lng, map) => {
        console.log(lat, lng);
        let { endPoints } = this.state;
        //Checking if clicked section already has a marker, then remove it
        //Temporarily using     
        // for(let i in endPoints){
        //     if(endPoints[i].lat)
        // }

        //Adding end points
        if(endPoints.length<2){
            endPoints.push({lat:lat, lng:lng})
        }
        else{
            endPoints.shift();
            endPoints.push({lat:lat, lng: lng})
        }
        this.setState({endPoints: endPoints});
        if(endPoints.length==2){
            const { google } = this.props
            const directionsService = new google.maps.DirectionsService();
            console.log(endPoints)
            directionsService.route(
                {
                    origin: new google.maps.LatLng(endPoints[0]),
                    destination: new google.maps.LatLng(endPoints[1]),
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log(result)
                        this.setState({
                            directions: result
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
        // if (!origin) {
        //     this.setState(
        //         {
        //             endPoints: {
        //                 origin: { lat: lat, lng: lng },
        //                 destination: null
        //             }
        //         });
        // }
        // else {
        //     this.setState(
        //         {
        //             endPoints: {
        //                 origin: origin,
        //                 destination: { lat: lat, lng: lng }
        //             }
        //         });
        // }
    }

    render() {
        const style = {
            width: '100vw',
            height: '100vh'
        }
        if (!this.props.loaded)
            return (
                <div>Loading...</div>
            )
        else {
            let { endPoints } = this.state;

            return (
                <Map
                    google={this.props.google} zoom={14}
                    center={{
                        lat: this.state.centre.lat,
                        lng: this.state.centre.lng
                    }}
                    onClick={(t, map, c) => this.onClickPlaceMarker(c.latLng.lat(), c.latLng.lng(), map)}
                >
                    {endPoints.map(v =>
                        <Marker position={v}>
                        </Marker>)
                    }
                    
                </Map>
            );
        }
    }
}

export default GoogleApiWrapper((props) => ({
    apiKey: 'AIzaSyC2CPTYNi9Sw7li14jUBdrbKrN0d2CKrjs'
}
))(DemoMap)