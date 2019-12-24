import React from 'react';
import '../../css/AvailableTrends.css';
import AuthService from '../../util/AuthService';
import swal from 'sweetalert';
import Trend from './Trend';
import $ from 'jquery';
import { BACKEND_API_URL } from '../../actions/types';

class AvailableTrends extends React.Component {
    isMountedAvailableTrends = false

    constructor(props) {
        super(props);

        this.state = {
            longitude: 0.0,
            latitude: 0.0,
            isGeolocationRejected: false,
            isGeolocationNotSupported: false,
            trends: [],
            isRetrievedTrends: false
        }
        this.Auth = new AuthService();

        this.twitterJwtToken = this.Auth.getTwitterToken();
        this.geolocationError = this.geolocationError.bind(this);
        this.geolocationSuccess = this.geolocationSuccess.bind(this);
        this.renderTwitterTrends = this.renderTwitterTrends.bind(this);
    }

    componentDidMount() {
        this.isMountedAvailableTrends = true;
        $(".trends-div-box").html("<div class='spinner-border text-primary twitter-explore-search-spinner' role='status'><span class='sr-only'>Loading...</span></div>");

        if(this.isMountedAvailableTrends) {
            if(!navigator.geolocation) {
                this.setState({ isGeolocationNotSupported: true });
            } else {
                navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError);
            }
        }
    }

    geolocationError() {
        this.setState({ isGeolocationRejected: true });
    }

    geolocationSuccess(position) {
        this.setState({ 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            fetch(`${BACKEND_API_URL}/twitter/available/closest/trends/${this.state.latitude}/${this.state.longitude}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${this.twitterJwtToken}`,
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response.json() })
            .then(json => {
                if(this.isMountedAvailableTrends) {
                    $(".trends-div-box").html("");

                    json.map((trend, index) => {
                        if(trend.tweetVolume !== -1) {
                            const element = {
                                name: trend.name,
                                countryName: trend.countryName,
                                tweetVolume: trend.tweetVolume
                            }
                            this.setState({ trends: this.state.trends.concat(element) });
                        }
                    });
                    this.setState({
                        isGeolocationNotSupported: false,
                        isGeolocationRejected: false,
                        isRetrievedTrends: true
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        });
    }

    notSupportedGeolocation(isGeolocationNotSupported) {
        if(isGeolocationNotSupported) {
            return (
                <div className="alert alert-danger">
                    Your browser does not support geolocation.
                </div>
            );
        }
        return null;
    }

    rejectGeolocation(isGeolocationRejected) {
        if(isGeolocationRejected) {
            return (
                <div className="alert alert-danger">
                    Location process rejected.
                    <br />
                    Unable to retrieve twitter trends.
                    <br />
                    Turn on your location.
                </div>
            );
        }
        return null;
    }

    renderTwitterTrends() {
        return this.state.trends.map((trend, index) => {
            return (
                <li className="list-group-item trends-list-item">
                    <Trend 
                        name={trend.name}
                        countryName={trend.countryName}
                        tweetVolume={trend.tweetVolume}
                    />
                </li>
            );
        });
    }

    componentWillUnmount() {
        this.isMountedAvailableTrends = false;
    }


    render() {
        let isGeolocationRejected = this.state.isGeolocationRejected;
        let isGeolocationNotSupported = this.state.isGeolocationNotSupported;
        let isRetrievedTrends = this.state.isRetrievedTrends;

        return (
            <div className="trends-div-box">
                { isGeolocationRejected &&
                    <div className="geolocation-twitter-trends-box">
                        { this.rejectGeolocation(isGeolocationRejected) }
                    </div>
                }
                {
                    isGeolocationNotSupported &&
                    <div className="geolocation-twitter-trends-box">
                        { this.notSupportedGeolocation(isGeolocationNotSupported) }
                    </div>
                }
                { isRetrievedTrends &&
                    <ul className="list-group trends-list">
                        { this.renderTwitterTrends() }
                    </ul>
                }
            </div>
        );
    }
}

export default AvailableTrends;