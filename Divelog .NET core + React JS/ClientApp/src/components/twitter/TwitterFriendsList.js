import React from 'react';
import '../../css/TwitterFriendsList.css';
import AuthService from '../../util/AuthService';
import Friend from './Friend';
import { BACKEND_API_URL } from '../../actions/types';

class TwitterFriendsList extends React.Component {
    isMountedFriendsList = false;

    constructor() {
        super();

        this.state = {
            friends: [],
            isRetrieved: false,
            isEmptyFriendsList: false
        }
        this.Auth = new AuthService();
        this.renderFriendsList = this.renderFriendsList.bind(this);
    }

    componentDidMount() {
        this.isMountedFriendsList = true;

        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/twitter/friends/list/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(json => {
            if(this.isMountedFriendsList) {
                if(json.length !== 0) {
                    json.map((friend, index) => {
                        const element = {
                            id: friend.id,
                            screenName: friend.screenName,
                            name: friend.name,
                            pictureUrl: friend["400x400ProfileImageURL"]
                        }
                        this.setState({ friends: this.state.friends.concat(element) });
                    });
                    this.setState({ isRetrieved: true });
                } else {
                    this.setState({ isEmptyFriendsList: true });
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this.isMountedFriendsList = false;
    }

    renderFriendsList() {
        return this.state.friends.map((friend, index) => {
            return (
                <li className="list-group-item twitter-friends-list-hover">
                    <Friend 
                        key={index}
                        id={friend.id}
                        screenName={friend.screenName}
                        name={friend.name}
                        pictureUrl={friend.pictureUrl}
                    />
                </li>
            );
        });
    }

    render() {
        let isRetrieved = this.state.isRetrieved;

        return (
            <ul className="list-group twitter-friends-list">
                <li className="list-group-item twitter-friend-invite-divelog-btn">
                    <button className="btn btn-success">Invite to divelog</button>
                </li>
                { isRetrieved && this.renderFriendsList() }
            </ul>
        );
    }
}

export default TwitterFriendsList;