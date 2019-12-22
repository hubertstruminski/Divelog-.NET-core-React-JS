import React from 'react';
import '../css/LogIn.css';
import logo from '../img/eDivelog.png';
import { withTranslation } from 'react-i18next';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthObject } from '../util/AuthObject';
import AuthService from '../util/AuthService';
import $ from 'jquery';
import TwitterLogin from 'react-twitter-auth';
import { BACKEND_API_URL } from '../actions/types';

class LogIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferrer: false
        }
        this.Auth = new AuthService();
        this.responseFacebook = this.responseFacebook.bind(this);
        this.onTwitterClick = this.onTwitterClick.bind(this);
    }

    componentDidMount() {
        $("nav").css({ "position": "fixed", "width": "100%"});
    }

    componentWillUnmount() {
        $("nav").css({ "position": "static"});
    }

    responseFacebook(response) {
        const loginRequest = {
            accessToken: response["accessToken"],
            email: response["email"],
            name: response["name"],
            userID: response["userID"],
            pictureUrl: response["picture"]["data"]["url"]
        }

        axios({
            method: 'POST',
            url: `${BACKEND_API_URL}/signin`,
            data: loginRequest,
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        }).then(response => {
            this.Auth.setToken(response["data"]);
        }).catch(err => {
            console.log(err);
        });

        AuthObject.authenticate(() => {
            this.setState(() => ({redirectToReferrer: true }));
        })
        AuthObject.setPrincipal(loginRequest);

        return <Redirect to="/dashboard/" />
    }

    onTwitterClick() {
        //window.location.href = "https://api.divelog.eu/signin"
        // window.location.href="http://localhost:5000/signin"
        window.location.href = "https://localhost:44321/twitter/signin";
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/dashboard' }}
        const { redirectToReferrer } = this.state;

        if(redirectToReferrer === true) {
            return <Redirect to={from} />
        }

        return(
            <div className="login-container">
                <div className="login-form-container form-container-shadow form-size">
                    <div>
                        <span className="logo-text">
                            {this.props.t("login.login")}
                        </span>
                        <br />
                        <img src={logo} alt="divelog" className="logo-space logo" />
                        <br />
                        Divelog
                        <br />
                        <hr />
                        <br />
                        <FacebookLogin
                            appId="455695445269575"
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="public_profile,user_friends"
                            callback={this.responseFacebook}
                            cssClass="btn btn-lg btn-fb fb-btn-white-font"
                            icon="<i className='fab fa-facebook-f pr-1' />"
                            textButton={this.props.t("login.facebook-btn")}
                            installed={true}
                            isDisabled={true}
                        />
                        <br />
                        <button 
                            type="button" 
                            className="btn btn-tw fb-btn-white-font btn-tw-background btn-tw-width"
                            onClick={this.onTwitterClick}
                        >
                            <i class="fab fa-twitter pr-1"></i> 
                            LOG IN WITH TWITTER
                        </button>
                        {/* <TwitterLogin 
                            loginUrl="http://divelog.us-east-1.elasticbeanstalk.com/signin/twitter"
                            onFailure={this.onFailed}
                            onSuccess={this.onSuccess}
                            requestTokenUrl="http://divelog.us-east-1.elasticbeanstalk.com/callback"
                       />
                       <br />
                        <TwitterLogin 
                            loginUrl="http://localhost:5000/signin/twitter"
                            onFailure={this.onFailed}
                            onSuccess={this.onSuccess}
                            requestTokenUrl="http://localhost:5000/callback"
                       /> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(LogIn);