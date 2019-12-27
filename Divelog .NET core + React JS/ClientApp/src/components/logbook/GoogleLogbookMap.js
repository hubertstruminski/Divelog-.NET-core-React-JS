import React from 'react';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import GoogleLogbookModal from '../logbook/GoogleLogbookModal';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import DeleteLogbookButton from '../logbook/DeleteLogbookButton';
import swal from 'sweetalert';
import GoogleLogbookMarkerModal from './GoogleLogbookMarkerModal';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class GoogleLogbookMap extends React.Component {
    constructor() {
        super();

        this.state = {
            latitude: '',
            longitude: '',
            marker: {},
            activeMarker: {},
            markers: [],
            showingInfoWIndow: false,
            selectedPlace: {},
            isFinishMarker: false,
            isAccessible: true,
            existingMarkerName: '',
            existingMarkerLatitude: '',
            existingMarkerLongitude: '',
            isUpdateLogbookRow: false
        }
        this.Auth = new AuthService();

        this.onMapClick = this.onMapClick.bind(this);
        this.updateMarker = this.updateMarker.bind(this);
        this.setFinishMarker = this.setFinishMarker.bind(this);
        this.setIsAccessible = this.setIsAccessible.bind(this);
        this.showAllMarkers = this.showAllMarkers.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.setUpdateLogbookRow = this.setUpdateLogbookRow.bind(this);
    }

    componentDidMount() {
        $(".add-dive-google-container div:first").css({
            "height": "350px",
            "position": "static"
        });

        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/get/markers`, {
            method: 'GET',
            headers: {
                'Authorization': `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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

        if(this.props.updateMarker != null) {
            const element = {
                id: this.props.updateMarker.id,
                name: this.props.updateMarker.name,
                latitude: this.props.updateMarker.latitude,
                longitude: this.props.updateMarker.longitude
            }
            this.setState({ markers: this.state.markers.concat(element) });
            this.setState({ marker: element}, () => {
                this.setState({ isUpdateLogbookRow: true });
            });
        }
    }

    onMapClick(t, map, coord) {
        if(this.state.isAccessible) {
            const { latLng } = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();

            this.setState({ 
                latitude: lat,
                longitude: lng,
                isAccessible: false
            });

            $(document).on('show.bs.modal', "#modalLogbookCenter", function (event) {
                $('#name').trigger('focus');
            });
            $("#modalLogbookCenter").modal('show');
        } else {
            swal(this.props.t("googleMap.modal.swalLocation.title"), this.props.t("googleMap.modal.swalLocation.text"), "error");
        }
    }

    onMarkerClick = (props, marker, e) => {
        if(this.state.isAccessible) {
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true,
                isAccessible: false,
                existingMarkerName: props.name,
                existingMarkerLatitude: props.position.lat,
                existingMarkerLongitude: props.position.lng
            });
            $(document).on('show.bs.modal', "#modalLogbookMarker", function (event) {});
            $("#modalLogbookMarker").modal('show');
        }
    }

    onClose = props => {
        if(this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    showMarker() {
        return (
            <Marker 
                name={this.state.marker.name}
                position={{ lat: this.state.marker.latitude, lng: this.state.marker.longitude }}
                onClick={this.onMarkerClick}
            />
        );
    }

    showAllMarkers() {
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

    onClose = props => {
        if(this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    showTableRow = () => {
        return (
            <tr>
                <th scope="row">
                    <b>1</b>
                </th>
                <td>{this.state.marker.name}</td>
                <td>{this.state.marker.latitude}</td>
                <td>{this.state.marker.longitude}</td>
                <td>
                    <DeleteLogbookButton 
                        id={this.state.marker.id}
                        updateMarker={this.updateMarker}
                        setFinishMarker={this.setFinishMarker}
                        setRef={this.setRef}
                        setIsAccessible={this.setIsAccessible}
                        setMarker={this.props.setMarker}
                    />
                </td>
            </tr>
        );
    }

    showMarkerRowFromUpdateLogbook(object) {
        return (
            <tr>
                <th scope="row">
                    <b>1</b>
                </th>
                <td>{object.name}</td>
                <td>{object.latitude}</td>
                <td>{object.longitude}</td>
                <td>
                    <DeleteLogbookButton 
                        id={object.id}
                        updateMarker={this.updateMarker}
                        setFinishMarker={this.setFinishMarker}
                        setIsAccessible={this.setIsAccessible}
                        setMarker={this.props.setMarker}
                        setUpdateLogbookRow={this.setUpdateLogbookRow}
                        isUpdating={true}
                    />
                </td>
            </tr>
        );
    }

    updateMarker(markerObject) {
        this.setState({ marker: markerObject });
    }

    setFinishMarker(value) {
        this.setState({ isFinishMarker: value });
    }

    setIsAccessible() {
        this.setState({ isAccessible: true });
    }

    setUpdateLogbookRow() {
        this.setState({ isUpdateLogbookRow: false });
    }

    render() {
        let isFinishMarker = this.state.isFinishMarker;
        let isUpdateLogbookRow = this.state.isUpdateLogbookRow;
        let marker = this.state.marker;

        let tableRow;
        if(isFinishMarker) {
            tableRow = this.showTableRow();
        } else {
            tableRow = "";
        }

        let updateTableRow;
        if(isUpdateLogbookRow) {
            updateTableRow = this.showMarkerRowFromUpdateLogbook(marker);
        } else {
            updateTableRow = "";
        }
         
        const mapStyle = {
            position: 'static',
            width: '100%',
            height: '350px',
        }

        let loadingScreen = (
            <div class="d-flex justify-content-center">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">
                        {this.props.t("loading")}
                    </span>
                </div>
            </div>
        )

        let map = (
            <div className="add-dive-google-container">
                <Map
                    google={this.props.google}
                    zoom={5}
                    style={mapStyle}
                    initialCenter={{ lat: 48.023, lng: 14.426}}
                    onClick={this.onMapClick}
                >
                    { isFinishMarker && this.showMarker() }
                    { this.showAllMarkers() }
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
                <GoogleLogbookModal 
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    updateMarker={this.updateMarker}
                    setFinishMarker={this.setFinishMarker}
                    setMarker={this.props.setMarker}
                    setIsAccessible={this.setIsAccessible}
                />
                <GoogleLogbookMarkerModal 
                    name={this.state.existingMarkerName}
                    latitude={this.state.existingMarkerLatitude}
                    longitude={this.state.existingMarkerLongitude}
                    updateMarker={this.updateMarker}
                    setFinishMarker={this.setFinishMarker}
                    setMarker={this.props.setMarker}
                    setIsAccessible={this.setIsAccessible}
                />
                <div className="add-dive-table">
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
                        <tbody ref={(el) => this.tbodyRef = el}>
                            { isFinishMarker && !isUpdateLogbookRow && tableRow }
                            { isUpdateLogbookRow && updateTableRow }
                        </tbody>
                    </table>
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
  )(GoogleLogbookMap);