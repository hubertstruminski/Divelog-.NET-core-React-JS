import decode from 'jwt-decode';

export default class AuthService {

    setToken(idToken) {
        localStorage.setItem("JwtToken", idToken);
    }

    getToken() {
        return localStorage.getItem("JwtToken");
    }

    getTwitterToken() {
        return localStorage.getItem("twitterJwtToken");
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);

            if(decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        } catch(error) {
            return false;
        }
    }

    getRightSocialToken() {
        let jwtToken = null;

        if(this.getTwitterToken() !== null) {
            jwtToken = this.getTwitterToken();
        }
        if(this.getToken() !== null) {
            jwtToken = this.getToken();
        }
        return jwtToken;
    }

    loggedIn() {
        let facebookJwtToken = this.getToken();
        let twitterJwtToken = this.getTwitterToken();

        if(facebookJwtToken !== null) {
            return !!facebookJwtToken && !this.isTokenExpired(facebookJwtToken);
        }

        if(twitterJwtToken !== null) {
            return !!twitterJwtToken && !this.isTokenExpired(twitterJwtToken);
        }
        return false;
    }

    logout() {
        localStorage.removeItem("JwtToken");
    }

    logoutTwitter() {
        localStorage.removeItem("twitterJwtToken");
    }
}