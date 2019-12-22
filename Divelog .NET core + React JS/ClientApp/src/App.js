import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './store';

import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';

import common_de from "./translations/de/common.json";
import common_en from "./translations/en/common.json";
import common_pl from './translations/pl/common.json';

import Header from './components/Layout/Header';
import LogIn from './components/LogIn';
import Home from './components/Layout/Home';
import AboutMe from './components/Layout/AboutMe';
import Donate from './components/Layout/Donate';
import Contact from './components/Layout/Contact';
import Facebook from './components/Facebook';
import GoogleMap from './components/googleMaps/GoogleMap';
import AddDive from './components/logbook/AddDive';
import Logbook from './components/logbook/Logbook';
import UpdateLogbook from './components/logbook/UpdateLogbook';
import Forum from './components/forum/Forum';
import AddTopic from './components/forum/AddTopic';
import TopicWithPosts from './components/forum/TopicWithPosts';
import UpdateTopic from './components/forum/UpdateTopic';
import Settings from './components/settings/Settings';
import Twitter from './components/Twitter';
import TwitterExplore from './components/twitter/twitter-explore/TwitterExplore';
import TwitterHome from './components/twitter/twitter-home/TwitterHome';
import TwitterMessagesBox from './components/twitter/twitter-messages/TwitterMessagesBox';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en', 
  resources: {
    en: {
      common: common_en
    },
    de: {
      common: common_de
    },
    pl: {
      common: common_pl
    }
  }
});

function App() {
  return (
    <Provider store={store} >
      <Router>
        <div className="App">
          <I18nextProvider i18n={i18next}>
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/about" component={AboutMe} />
            <Route exact path="/donate" component={Donate} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/login" component={LogIn} />
              <Route exact path="/dashboard" component={Facebook} />
              <Route exact path="/map" component={GoogleMap} />
              <Route exact path="/logbook" component={Logbook} />
              <Route exact path="/add/dive" component={AddDive} />
              <Route exact path="/update/logbook/:id" component={UpdateLogbook} />
              <Route exact path="/forum" component={Forum} />
              <Route exact path="/create/topic/:selectedForum" component={AddTopic} />
              <Route exact path="/topic/:id/:languageForum/posts" component={TopicWithPosts} />
              <Route exact path="/update/topic/:id" component={UpdateTopic} />
              <Route exact path="/settings" component={Settings} />
              
              <Route exact path="/twitter/messages" component={TwitterMessagesBox} />
              <Route exact path="/twitter/explore" component={TwitterExplore} twitterExplore={true} />
              <Route exact path="/twitter/home" component={TwitterHome} />
              <Route exact path={"/twitter/likes", "/twitter/likes/:jwtToken"} component={Twitter} />
              
          </I18nextProvider>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
