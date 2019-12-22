import React from 'react';
import '../../css/GoogleMap.css';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import GoogleModal from './GoogleModal';
import $ from 'jquery';
import DeleteButton from './DeleteButton';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class GoogleMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: [],
            isFinishMarker: false,
            latitude: '',
            longitude: '',
            isDeletedMarker: false,
            deletedMarkerId: 0
        }
        this.Auth = new AuthService();

        this.onMapClick = this.onMapClick.bind(this);
        this.setFinishMarker = this.setFinishMarker.bind(this);
        this.setIsDeletedMarker = this.setIsDeletedMarker.bind(this);
        this.fetchMarkers = this.fetchMarkers.bind(this);
        this.setDeletedMarkerId = this.setDeletedMarkerId.bind(this);
        this.addMarkerToArray = this.addMarkerToArray.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: false });
        
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/get/markers/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            console.log(jsonData);
            if(jsonData.length !== 0) {
                jsonData.map((marker, index) => {
                    let element = {
                        id: marker.id,
                        name: marker.name,
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }
                    this.setState({
                        markers: this.state.markers.concat(element)
                    })
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    fetchMarkers() {
        let jwtToken = this.Auth.getRightSocialToken();

        this.setState({ markers: [] }, () => {
            fetch(`${BACKEND_API_URL}/get/markers/${jwtToken}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json'
                }
            })
            .then(response => { return response.json() })
            .then(jsonData => {
                jsonData.map((marker, index) => {
                    let element = {
                        id: marker.id,
                        name: marker.name,
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }
                    this.setState({
                        markers: this.state.markers.concat(element)
                    })
                })
            }).catch(err => {
                console.log(err);
            });
        });
    }

    showMarkers = () => {
        return this.state.markers.map((marker, index) => {
            return (
                <Marker 
                    key={index} 
                    name={marker.name}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    onClick={this.onMarkerClick}
                />
            );
        });
    }

    showTableRows = () => {
        let i = 0;
        return this.state.markers.map((marker, index) => {
            return (
                <tr key={index}>
                    <th scope="row">
                        <b>{++i}</b>
                    </th>
                    <td>{marker.name}</td>
                    <td>{marker.latitude}</td>
                    <td>{marker.longitude}</td>
                    <td>
                        <DeleteButton 
                            id={marker.id}
                            setIsDeletedMarker={this.setIsDeletedMarker}
                            setDeletedMarkerId={this.setDeletedMarkerId}
                            fetchMarkers={this.fetchMarkers}
                        />
                    </td>
                </tr>
            );
        })
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if(this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    onMapClick(t, map, coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.setState({ 
            latitude: lat,
            longitude: lng
        });

        $(document).on('show.bs.modal', "#modalCenter", function (event) {
            $('#name').trigger('focus');
        });
        $("#modalCenter").modal('show');
    }

    setFinishMarker() {
        this.setState({ isFinishMarker: true });
    }

    setIsDeletedMarker() {
        this.setState({ isDeletedMarker: true });
    }

    setDeletedMarkerId(value) {
        this.setState({ deletedMarkerId: value }, () => {
            let id = this.state.deletedMarkerId;
            let index = 0;
            this.state.markers.map((marker, index) => {
                if(marker.id === id) {
                    this.setState({ markers: this.state.markers.splice(index, 1) }, () => {
                        this.forceUpdate();
                    });
                }
                index++;
            });
        });
    }

    addMarkerToArray(object) {
        this.setState({ markers: this.state.markers.concat(object) });
    }

    render() {
        const mapStyle = {
            width: '100%',
            height: '100%',
        }

        let loadingScreen = (
            <div className="d-flex justify-content-center">
                <div className="spinner-grow" role="status">
                    <span className="sr-only">
                        {this.props.t("loading")}
                    </span>
                </div>
            </div>
        )

        let map = (
            <div className="google-container">
                <div className="story-header"> 
                    {this.props.t("googleMap.story")}
                </div>
                <br />
                <div className="google-center">
                    <div className="marker-table">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <b>#</b>
                                        </th>
                                        <th scope="col">
                                            {this.props.t("googleMap.table.name")}
                                        </th>
                                        <th scope="col">
                                            {this.props.t("googleMap.table.latitude")}
                                        </th>
                                        <th scope="col">
                                            {this.props.t("googleMap.table.longitude")}
                                        </th>
                                        <th scope="col">
                                            {this.props.t("googleMap.table.delete")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.showTableRows() }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <Map
                        google={this.props.google}
                        zoom={5}
                        style={mapStyle}
                        initialCenter={{ lat: 48.023, lng: 14.426}}
                        onClick={this.onMapClick}
                    >
                        { this.showMarkers() }
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                            onClose={this.onClose}
                        >
                        <div className="alert alert-success" role="alert">
                            <h4>{this.state.selectedPlace.name}</h4>
                        </div>
                        </InfoWindow>
                    </Map>
                    <GoogleModal 
                        latitude={this.state.latitude}
                        longitude={this.state.longitude}
                        setFinishMarker={this.setFinishMarker}
                        addMarkerToArray={this.addMarkerToArray}
                        fetchMarkers={this.fetchMarkers}
                    />
                </div>
            </div>     
        )
        let content = this.state.isLoading ? loadingScreen : map;

        return (
            <div>
                { content }
            </div>
        );
    }
}

export default compose(
    GoogleApiWrapper(
    (props) => ({
      apiKey: 'AIzaSyBgb4kpatKEjsOGsxplxFyRfw1K_wGhLTo',
      language: props.language,
    }
  )),
    withTranslation("common")
  )(GoogleMap);