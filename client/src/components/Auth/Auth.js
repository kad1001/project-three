import history from '../../utils/history';
import API from '../../utils/API';
import auth0 from 'auth0-js';
// import { AUTH_CONFIG } from './auth0-variables';


export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userProfile;
  scopes;
  requestedScopes = 'openid profile read:messages write:messages';

  auth0 = new auth0.WebAuth({
    domain: 'dev-b23leygb.auth0.com',
    clientID: 'j7rVTQatqbdB5p4DB7veYJS5aY7CzGQG',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'http://localhost:3001/api',
    responseType: 'token id_token',
    scope: 'openid profile read:messages'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.userHasScopes = this.userHasScopes.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);

      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // Set the users scopes
    this.scopes = authResult.scope || this.requestedScopes || '';

    // navigate to the home route
    history.replace('/home');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
        //  alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  getProfile(cb) {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      // if (profile) {
        this.userProfile = profile;
        console.log(profile)

        var email = profile.nickname;
        var estring = email + '@gmail.com';

        if (profile.given_name && profile.family_name) {
        var user = {
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: estring
        }
      } else {

        user = {
          email: profile.name
        }
      }

        console.log(user);

        API.saveUser(user);
      // }
      cb(err, profile);
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove user scopes
    this.scopes = null;

    // Remove user profile
    this.userProfile = null;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

  userHasScopes(scopes) {
    const grantedScopes = this.scopes.split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }
}