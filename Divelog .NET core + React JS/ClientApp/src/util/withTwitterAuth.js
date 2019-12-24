import React from 'react';
import AuthService from './AuthService';
import { BACKEND_API_URL } from '../actions/types';
import axios from 'axios';

export default function withTwitterAuth(AuthComponent, props) {
    const Auth =  new AuthService();
    let customAuthComponent = false;

    class AuthWrapped extends React.Component {
        constructor() {
            super();

            this.state = {
                isTwitterComponent: true
            }
        }

        setRedirectForTwitterExplore(props, url) {
            if(props.hasOwnProperty("twitterExploreForCategories")) {
                if(props.twitterExploreForCategories) {
                    this.props.history.replace(url);
                }
            }

            if(props.hasOwnProperty("twitterExplore")) {
                if(props.twitterExplore) {
                    this.props.history.replace(url);
                }
            }
        }

        componentWillMount() {
            customAuthComponent = true;
            
            if(this.props.match.path === "/twitter/likes/:jwtToken") {
                if(props !== undefined) {
                    if(this.props.location.pathname === "/twitter/explore") {
                        customAuthComponent && this.setRedirectForTwitterExplore(props, "/twitter/explore");
                        return;
                    }
                    if(this.props.location.pathname === "/twitter/home") {
                        customAuthComponent && this.props.history.replace("/twitter/home");
                        return;
                    }
                } 
                axios(`${BACKEND_API_URL}/twitter/login/validate/token`, {
                    method: 'POST',
                    data: JSON.stringify(this.props.match.params.jwtToken),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if(response.status === 200) {
                        localStorage.setItem("twitterJwtToken", this.props.match.params.jwtToken);
                        try {
                            customAuthComponent && this.props.history.replace(`/twitter/likes/${this.props.match.params.jwtToken}`);
                        } catch(err) {
                            if(this.props.match.params.jwtToken) {
                                Auth.logoutTwitter();
                                this.props.history.replace("/login");
                            }
                        } 
                    } else {
                        this.props.history.replace("/login");
                        return;
                    }
                });
            } else {
                this.setState({ isTwitterComponent: false });
            }

            // let facebookJwtToken = Auth.getToken();

            // if(facebookJwtToken !== null && facebookJwtToken !== undefined) {
            //     try {
            //         customAuthComponent && this.props.history.replace("/dashboard");
            //     } catch(err) {
            //         Auth.logout();
            //         this.props.history.replace("/login");
            //     }
            // }
        }

        componentWillUnmount() {
            customAuthComponent = false;
        }

        render() {
            let isTwitterComponent = this.state.isTwitterComponent;
            if(!isTwitterComponent) {
                return null;
            }
            if(Auth.loggedIn()) {
                return (
                    customAuthComponent && <AuthComponent history={this.props.history} />
                );
            } else {
                return null;
            }
        }
    }
    return AuthWrapped;
}