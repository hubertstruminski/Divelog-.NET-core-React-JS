import React from 'react';
import '../../../css/TwitterExploreSearch.css';
import AuthService from '../../../util/AuthService';
import axios from 'axios';
import swal from 'sweetalert';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterExploreSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ''
        }
        this.Auth = new AuthService();

        this.onChange = this.onChange.bind(this);
        this.onEnterClick = this.onEnterClick.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onEnterClick(e) {
        if(e.keyCode === 13) {
            this.props.addNewTweet("<div class='spinner-border text-primary twitter-explore-search-spinner' role='status'><span class='sr-only'>Loading...</span></div>");
            let jwtToken = this.Auth.getRightSocialToken();

            axios({
                url: `${BACKEND_API_URL}/twitter/search/tweets`,
                method: 'POST',
                data: JSON.stringify(this.state.search),
                headers: {
                    'Authorization': `${jwtToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                } else {
                    this.props.addNewTweet(response.data);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <div className="twitter-explore-search-container">
                <input 
                    type="text" 
                    name="search"
                    className="twitter-explore-search-input" 
                    placeholder="Search Twitter"
                    value={this.state.search}
                    onChange={this.onChange}
                    onKeyDown={this.onEnterClick}
                />
            </div>
        );        
    }
}

export default TwitterExploreSearch;