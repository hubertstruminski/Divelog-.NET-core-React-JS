import React from 'react';
import '../../css/TwitterCategoriesCard.css';
import { withRouter } from 'react-router';
import withAuth from '../../util/withAuth';
import { Link } from 'react-router-dom';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class TwitterCategoriesCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pictureUrl: ''
        }
        this.Auth = new AuthService();
        this.jwtToken = this.Auth.getRightSocialToken();
    }

    componentDidMount() {
        fetch(`${BACKEND_API_URL}/getuserdata/${this.jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            this.setState({
                pictureUrl: jsonData.pictureUrl,
            }, () => {
                // fetch(`/twitter/webhooks/register/${jwtToken}`, {
                //     method: 'GET',
                //     headers: {
                //       'content-type': 'application/json'
                //     }
                // }).then(response => {
                //     console.log(response);
                // });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="twitter-categories-container">
                <ul className="list-group twitter-categories-list">
                    <Link to="/twitter/home" className="list-group-item list-group-item-hover">
                        <div className="twitter-categories-icons-box">
                            <i className="fas fa-home"></i> Home
                        </div>
                    </Link>
                    <Link to="/twitter/explore" className="list-group-item list-group-item-hover">
                        <div className="twitter-categories-icons-box">
                            <span style={{ fontWeight: '900' }}>#</span> Explore
                        </div>
                    </Link>
                    <Link to={`/twitter/likes/${this.jwtToken}`} className="list-group-item list-group-item-hover">
                        <div className="twitter-categories-icons-box">
                            <i className="fas fa-clock"></i> Timeline likes
                        </div>
                    </Link>
                    <li className="list-group-item list-group-item-hover">
                        <div className="twitter-categories-icons-box">
                            <i className="fas fa-bell"></i> Notifications
                        </div>
                    </li>
                    <Link to="/twitter/messages" className="list-group-item list-group-item-hover">
                        <div className="twitter-categories-icons-box">
                            <i className="far fa-envelope"></i> Messages
                        </div>
                    </Link>
                    <li 
                        className="list-group-item list-group-item-hover"
                    >
                        <div className="twitter-categories-icons-box">
                            <img 
                            src={this.state.pictureUrl} 
                            alt="Avatar" 
                            className="twitter-categories-avatar"
                            /> Profile
                        </div>
                    </li>
                    <li className="list-group-item list-group-item-hover add-tweet-button">
                        <a 
                            className="twitter-share-button"
                            href="https://twitter.com/intent/tweet"
                            data-size="large"
                        >
                            Tweet
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

// export default withRouter(withAuth(TwitterCategoriesCard, { twitterExploreForCategories: true }));
export default withRouter(TwitterCategoriesCard);