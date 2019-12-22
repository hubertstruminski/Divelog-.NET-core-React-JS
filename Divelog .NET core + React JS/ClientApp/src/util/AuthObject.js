export const AuthObject = {
    isAuthenticated: false,
    accessToken: '',
    userID: '',
    name: '',
    email: '',

    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100);
    },

    setPrincipal(requestObject) {
        this.accessToken = requestObject.accessToken;
        this.userID = requestObject.userID;
        this.name = requestObject.name;
        this.email = requestObject.email;
        this.pictureUrl = requestObject.pictureUrl;
    },

    signout() {
        this.isAuthenticated = false;
    }
}