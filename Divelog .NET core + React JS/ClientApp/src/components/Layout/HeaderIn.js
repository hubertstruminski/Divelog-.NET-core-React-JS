import React from 'react';
import '../../css/Header.css';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import $ from 'jquery';
import SearchFriends from '../SearchFriends';
import Friends from '../Friends';
import Messenger from '../Messenger';
import Notifications from '../Notifications';
import Menu from '../Menu';
import AuthService from '../../util/AuthService';
import { withRouter } from 'react-router';
import withAuth from '../../util/withAuth';
import { compose } from 'redux';
import { BACKEND_API_URL } from '../../actions/types';

class HeaderIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: '',
            email: '',
            name: '',
            userID: '',
            pictureUrl: ''
        }
        this.Auth = new AuthService();
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        let jwtToken = null;

        if(this.Auth.getTwitterToken() !== null) {
            jwtToken = this.Auth.getTwitterToken();
        }
        if(this.Auth.getToken() !== null) {
            jwtToken = this.Auth.getToken();
        }

        fetch(`${BACKEND_API_URL}/getuserdata/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            this.setState({
                accessToken: jsonData.accessToken,
                email: jsonData.email,
                name: jsonData.name,
                userID: jsonData.userID,
                pictureUrl: jsonData.pictureUrl
            });
        }).catch(err => {
            console.log(err);
        });

        $("nav").css({ 
            "position": "fixed", 
            "top": "0", 
            "width": "100%", 
            "z-index": "1000" 
        });

        let isActive = false;
        $("#left-menu-icon").click(function() {
            if(!isActive) {
                $("#left-menu").animate({ left: '0' }, 500);
                isActive = true;
                return;
            }

            if(isActive) {
                $("#left-menu").animate({ left: '-15%' }, 500);
                isActive = false;
                return;
            }
        });
    }


    onSubmit() {
        this.logout();

        if(this.Auth.getTwitterToken() !== null) {
            this.Auth.logoutTwitter();
        }
        if(this.Auth.getToken() !== null) {
            this.Auth.logout();
        }
        this.props.history.push("/login");
    }

    logout = async () => {
        await fetch(`${BACKEND_API_URL}/logout/${this.state.email}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }


    render() {
        const  { i18n } = this.props;

        return (
            <div>
                <header>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed">
                        <Link to="/home" className="navbar-brand">
                            <span className="logoSize">
                                Divelog
                            </span>
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item mt-3">
                                    <i
                                        onClick={() => i18n.changeLanguage("en")} 
                                        className="gb uk flag nav-link"
                                    />
                                </li>
                                <li className="nav-item mt-3">
                                    <i 
                                        onClick={() => i18n.changeLanguage("de")} 
                                        className="de flag nav-link"
                                    />
                                </li>
                                <li className="nav-item mt-3">
                                    <i 
                                        onClick={() => i18n.changeLanguage("pl")} 
                                        className="pl flag nav-link" 
                                    />
                                </li>
                                <li className="nav-item">
                                    <div className="nav-link" id="left-menu-icon">
                                        <i className="fas fa-bars"></i>
                                    </div>
                                </li>
                            </ul>
                            <ul className="collapse navbar-collapse ul-no justify-content-md-center">
                                <li className="mt-3">
                                    <SearchFriends
                                        accessToken={this.state.accessToken}
                                        email={this.state.email}
                                        name={this.state.name}
                                        userID={this.state.userID}
                                    />
                                </li>
                            </ul>
                            <ul className="navbar-nav my-lg justify-content-end">
                                <li className="nav-item nav-link">
                                    <Friends
                                        accessToken={this.state.accessToken}
                                        email={this.state.email}
                                        name={this.state.name}
                                        userID={this.state.userID}
                                    />
                                </li>
                                <li className="nav-item nav-link">
                                    <Messenger 
                                        accessToken={this.state.accessToken}
                                        email={this.state.email}
                                        name={this.state.name}
                                        userID={this.state.userID}
                                    />
                                </li>
                                <li className="nav-item nav-link">
                                    <Notifications 
                                        accessToken={this.state.accessToken}
                                        email={this.state.email}
                                        name={this.state.name}
                                        userID={this.state.userID}
                                    />
                                </li>
                                <li className="nav-item nav-link mt-3">
                                    <img 
                                        src={this.state.pictureUrl} 
                                        alt="Profil" 
                                        className="header-profil-picture"
                                    />
                                </li>
                                <li className="nav-item nav-link mt-3">
                                    {this.state.name}
                                </li>
                                <li className="nav-item mt-1">
                                    <div className="nav-link">
                                        <button
                                            onClick={this.onSubmit}
                                            className="btn btn-danger"
                                        >
                                            {this.props.t("header.logout")}
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <div id="left-menu">
                    <Menu />
                </div>
            </div>
        );
    }
}

export default withRouter(withAuth(withTranslation("common")(HeaderIn)));