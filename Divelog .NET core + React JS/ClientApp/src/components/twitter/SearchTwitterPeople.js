import React from 'react';
import '../../css/TwitterGroupsCard.css';
import AuthService from '../../util/AuthService';
import axios from 'axios';
import twitterVerified from '../../img/twitter-verified.png';
import { BACKEND_API_URL } from '../../actions/types';

class SearchTwitterPeople extends React.Component {
    isMountedSearchTwitterPeople = false;
    
    constructor(props) {
        super(props);

        this.state = {
            searchPeople: '',
            timeInterval: 0,
            searchPeopleList: [],
            isSearched: false
        }
        this.Auth = new AuthService();
        this.twitterJwtToken = this.Auth.getTwitterToken();

        this.onTwitterSearchChange = this.onTwitterSearchChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getPeopleList = this.getPeopleList.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentDidMount() {
        this.isMountedSearchTwitterPeople = true;
    }

    onTwitterSearchChange(e) {
        this.setState({
            searchPeople: e.target.value
        }, () => {
            if(this.state.searchPeople && this.state.searchPeople.length > 0) {
                this.getUsers();
            } else if(!this.state.searchPeople) {
                this.setState({ searchPeopleList: [] });
            }
        });
    }

    onBlur(e) {
        if(this.state.searchPeople.length === 0) {
            this.setState({ searchPeopleList: [] });
        }
    }

    getUsers() {
        let searchPeople = this.state.searchPeople;
        axios({ 
            url: `${BACKEND_API_URL}/twitter/users/search/${this.state.searchPeople}/${this.twitterJwtToken}`,
            method: 'POST',
            body: searchPeople,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(this.isMountedSearchTwitterPeople) {
                this.setState({ searchPeopleList: [] });
                let counter = 0;
                response.data.map((person, index) => {
                    if(counter === 10) {
                        return;
                    }
                    const element = {
                        id: person.id,
                        name: person.name,
                        pictureUrl: person['400x400ProfileImageURL'],
                        screenName: person.screenName,
                        verified: person.verified
                    }
                    this.setState({ searchPeopleList: this.state.searchPeopleList.concat(element) });
                    counter++;
                }); 
                this.setState({ isSearched: true });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    getPeopleList() {
        return this.state.searchPeopleList.map((person, index) => {
            let verified = '';
            if(person.verified) {
                verified = "- Verified";
            } else {
                verified = "";
            }
            return (
                <div>
                    <li className="list-group-item list-group-search-person">
                        <div className="search-li-item-float search-1-div">
                            <img src={person.pictureUrl} className="search-picture-person" alt="Person" />
                        </div>
                        <div className="search-li-item-float search-2-div">
                            {person.verified && <img src={twitterVerified} className="twitter-verified" alt="Twitter user verified" /> }
                            {person.name} 
                            <br />
                            @{person.screenName}
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </li>
                </div>
            );
        });
    }

    componentWillUnmount() {
        this.isMountedSearchTwitterPeople = false;
    }

    render() {
        let isSearched = this.state.isSearched;

        return (
            <div className="search-people-bar">
            <ul className="list-group">
                <li id="search-twitter-people" className="list-group-item">
                    <input 
                        type="text"
                        value={this.state.searchPeople}
                        placeholder="Search Twitter"
                        className="form-control input-search-twitter"
                        onChange={this.onTwitterSearchChange}
                        onBlur={this.onBlur}
                    />
                </li>
                { isSearched &&
                    <div className="list-searched-people">
                        {this.getPeopleList() }
                    </div>
                }
            </ul>
            </div>
        );
    }
}

export default SearchTwitterPeople;