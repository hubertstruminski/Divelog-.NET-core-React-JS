import HeaderIn from "./HeaderIn";
import HeaderOut from "./HeaderOut";
import { withRouter } from 'react-router-dom';
import React from 'react';
import AuthService from "../../util/AuthService";

const Auth = new AuthService();

const Header = withRouter(({ history }) => (
    Auth.loggedIn() ? (
        <HeaderIn />
    ) : (
        <HeaderOut />
    )
));

export default Header;