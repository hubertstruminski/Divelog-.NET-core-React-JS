import React from 'react';
import '../../../css/twitter-messages/TwitterMessagesBox.css';
import AuthService from '../../../util/AuthService';
import TwitterCategoriesCard from '../TwitterCategoriesCard';
import TwitterFriendsList from '../TwitterFriendsList';
import $ from 'jquery';
import TwitterMessagesSearch from './TwitterMessagesSearch';
import TwitterMessagesInbox from './TwitterMessagesInbox';
import SearchPeopleConversationModal from './SearchPeopleConversationModal';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterMessagesBox extends React.Component {
    isMountedTwitterMessagesBox = false;
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
            isVisibleModalToSearch: false
        }
        this.Auth = new AuthService();
        this.searchPeopleToConversation = this.searchPeopleToConversation.bind(this);
        this.setIsNotVisibleModalToSearch = this.setIsNotVisibleModalToSearch.bind(this);
    }

    componentDidMount() {
        // $(".twitter-container").html("");
        // $(".twitter-container").css({ "width": "0", "height": "0" });
        this.isMountedTwitterMessagesBox = true;
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/getuserdata/${jwtToken}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            if(this.isMountedTwitterMessagesBox) {
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

    searchPeopleToConversation() {
        this.setState({ isVisibleModalToSearch: true });
    }

    setIsNotVisibleModalToSearch() {
        this.setState({ isVisibleModalToSearch: false });
    }

    componentWillUnmount() {
        this.isMountedTwitterMessagesBox = false;
    }

    render() {
        let isVisibleModalToSearch = this.state.isVisibleModalToSearch;
        return (
            <React.Fragment>
                {
                    isVisibleModalToSearch && 
                    <SearchPeopleConversationModal
                        setIsNotVisibleModalToSearch={this.setIsNotVisibleModalToSearch}
                    />
                }
                <div className="twitter-messages-container">
                    <div className="twitter-messages-grid-container">
                        <div className="twitter-messages-grid-item-1">
                            <div className="twitter-messages-left-categories-container">
                                <div className="twitter-messages-profil-container">
                                    { this.state.name }
                                </div>
                                <TwitterCategoriesCard
                                    pictureUrl={this.state.pictureUrl}
                                    screenName={this.state.screenName}
                                />    
                            </div>
                        </div>
                        <div className="twitter-messages-container-feed">
                            <TwitterMessagesInbox 
                                searchPeopleToConversation={this.searchPeopleToConversation}
                            />
                        </div>
                        <div className="twitter-messages-grid-item-3">
                            <div className="twitter-messages-rr-container">
                                <div className="twitter-messages-friends-container">
                                    {/* <TwitterFriendsList /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TwitterMessagesBox;