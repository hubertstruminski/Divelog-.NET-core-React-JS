import React from 'react';
import '../css/TimelineLikes.css';
import withTwitterAuth from '../util/withTwitterAuth';
import AuthService from '../util/AuthService';
import TwitterCategoriesCard from './twitter/TwitterCategoriesCard';
import SearchTwitterPeople from './twitter/SearchTwitterPeople';
import AvailableTrends from './twitter/AvailableTrends';
import TwitterFriendsList from './twitter/TwitterFriendsList';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { BACKEND_API_URL } from '../actions/types';

class Twitter extends React.Component {
    isMountedTwitter = false;
    constructor(props) {
        super(props);

        this.state = {
            accessToken: '',
            email: '',
            name: '',
            userID: '',
            pictureUrl: '',
            providerId: '',
            screenName: '',
            tokenSecret: ''
        }
        this.Auth = new AuthService();
    }

    componentDidMount() {
        this.isMountedTwitter = true;
        let jwtToken = this.Auth.getRightSocialToken();

        this.isMountedTwitter && window.twttr.ready(
            function (twttr) {
                twttr.widgets.load(document.getElementsByClassName("feed-container")[0]);
            }
          );
        

        fetch(`${BACKEND_API_URL}/getuserdata/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {return response.json()})
        .then(jsonData => {
            if(this.isMountedTwitter) {
                $(".tweets-likes-container").html("");
                this.setState({
                    accessToken: jsonData.accessToken,
                    email: jsonData.email,
                    name: jsonData.name,
                    twitterUserID: jsonData.twitterUserID,
                    pictureUrl: jsonData.pictureUrl,
                    providerId: jsonData.providerId,
                    screenName: jsonData.screenName,
                    tokenSecret: jsonData.tokenSecret
                }, () => {
                    window.twttr.widgets.createTimeline(
                    {
                        sourceType: 'likes',
                        screenName: this.state.screenName
                    },
                    document.getElementsByClassName("tweets-likes-container")[0],
                    {
                        width: '100%',
                        height: '100%',
                        related: 'twitterdev,twitterapi'
                    });
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this.isMountedTwitter = false;
    }

    render() {
        return (
            <div className="twitter-container">
                <div className="twitter-grid-container">
                    <div className="twitter-grid-item-1">
                        <div className="twitter-left-categories-container">
                            <div className="twitter-profil-container">
                                { this.state.name }
                            </div>
                            <TwitterCategoriesCard
                                pictureUrl={this.state.pictureUrl}
                                screenName={this.state.screenName}
                            />    
                        </div>
                    </div>
                    <div className="feed-container">
                        <div className="tweets-likes-container">

                        </div>
                    </div>
                    <div className="twitter-grid-item-3">
                        <div className="twitter-rl-container">
                            <div className="twitter-groups-container">
                                <SearchTwitterPeople />
                                <AvailableTrends />
                            </div>
                        </div>
                        <div className="twitter-rr-container">
                            <div className="twitter-friends-container">
                                {/* <TwitterFriendsList /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTwitterAuth(Twitter);