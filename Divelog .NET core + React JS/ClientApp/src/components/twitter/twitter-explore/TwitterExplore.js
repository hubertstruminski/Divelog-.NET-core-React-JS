import React from 'react';
import '../../../css/twitter-explore/TwitterExplore.css';
import withAuth from '../../../util/withAuth';
import AuthService from '../../../util/AuthService';
import TwitterCategoriesCard from '../TwitterCategoriesCard';
import SearchTwitterPeople from '../SearchTwitterPeople';
import AvailableTrends from '../AvailableTrends';
import TwitterExploreSearch from './TwitterExploreSearch';
import $ from 'jquery';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterExplore extends React.Component {
    isMountedTwitterExplore = false;
    constructor(props) {
        super(props);

        this.state = {
            accessToken: '',
            email: '',
            name: '',
            twitterUserID: '',
            pictureUrl: '',
            providerId: '',
            screenName: '',
            tokenSecret: '',
            searchTweets: ''
        }
        this.Auth = new AuthService();
        this.addNewTweet = this.addNewTweet.bind(this);
    }

    componentDidMount() {
        this.isMountedTwitterExplore = true;

        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/getuserdata/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            if(this.isMountedTwitterExplore) {
                this.setState({
                    accessToken: jsonData.accessToken,
                    email: jsonData.email,
                    name: jsonData.name,
                    twitterUserID: jsonData.twitterUserID,
                    pictureUrl: jsonData.pictureUrl,
                    providerId: jsonData.providerId,
                    screenName: jsonData.screenName,
                    tokenSecret: jsonData.tokenSecret
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    addNewTweet(newTweets) {
        let output = this.convertUnicode(newTweets);
        this.setState({ searchTweets: output }, () => {
            $(".twitter-explore-search-tweets-container").html(this.state.searchTweets);
            $(".twitter-tweet").attr("data-width", "520px");
        });
    }

    convertUnicode(input) {
        return input.replace(/\\u(\w\w\w\w)/g, function (a, b) {
            var charcode = parseInt(b, 16);
            var convertedWord = String.fromCharCode(charcode);
            return convertedWord.replace("\n", "").replace("\"", "");
        });
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
                        <TwitterExploreSearch 
                            addNewTweet={this.addNewTweet}
                        />
                        <div className="twitter-explore-search-tweets-container"></div>
                    </div>
                    <div className="twitter-grid-item-3">
                        <div className="twitter-rl-container">
                            <div className="twitter-groups-container">
                                    <SearchTwitterPeople />
                                    <AvailableTrends />
                            </div>
                        </div>
                        <div className="twitter-rr-container">
                            <div className="twitter-friends-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(TwitterExplore, {  twitterExplore: true });