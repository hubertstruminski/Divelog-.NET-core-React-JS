import React from 'react';
import '../../../css/TimelineLikes.css';
import withAuth from '../../../util/withAuth';
import AuthService from '../../../util/AuthService';
import TwitterCategoriesCard from '../TwitterCategoriesCard';
import SearchTwitterPeople from '../SearchTwitterPeople';
import AvailableTrends from '../AvailableTrends';
import TwitterFriendsList from '../TwitterFriendsList';
import $ from 'jquery';
import TwitterHomeAdd from './TwitterHomeAdd';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterHome extends React.Component {
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
            tokenSecret: '',
            tweets: '',
            isTweetsRetrieved: false
        }
        this.Auth = new AuthService();

        this.addNewTweet = this.addNewTweet.bind(this);
    }

    componentDidMount() {
        this.isMountedTwitter = true;
        $(".home-timeline-container").html("<div class='spinner-border text-primary twitter-explore-search-spinner' role='status'><span class='sr-only'>Loading...</span></div>");
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/getuserdata`, {
            method: 'GET',
            headers: {
                'Authorization': `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(jsonData => {
            if(this.isMountedTwitter) {
                this.setState({
                    name: jsonData.name,
                    pictureUrl: jsonData.pictureUrl,
                    screenName: jsonData.screenName,
                }, () => {
                        fetch(`${BACKEND_API_URL}/twitter/home/timeline`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `${jwtToken}`,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            return response.text();
                        }).then(text => {
                            let output = this.convertUnicode(text);
                            console.log(output);
                            this.setState({ tweets: output }, () => {
                                $(".home-timeline-container").html(output);
                                $(".twitter-tweet").attr("data-width", "520px");
                            });
                        });

                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    convertUnicode(input) { 
        return input.replace(/\\u(\w\w\w\w)/g, function (a, b) {
            var charcode = parseInt(b, 16);
            var convertedWord = String.fromCharCode(charcode);
            return convertedWord.replace("\n", "").replace("\"", "");
        });
    }

    addNewTweet(newTweet) {
        this.setState({ tweets: newTweet + this.state.tweets }, () => {
            $(".home-timeline-container").html(this.state.tweets);
            $(".twitter-tweet").attr("data-width", "520px");
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
                    <div className="twitter-home-container">
                        <TwitterHomeAdd 
                            pictureUrl={this.state.pictureUrl}
                            addNewTweet={this.addNewTweet}
                        />
                        <div className="home-timeline-container">

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

export default withAuth(TwitterHome, { twitterHome: true });
// export default withAuth(TwitterHome);