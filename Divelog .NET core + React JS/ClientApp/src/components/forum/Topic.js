import React from 'react';
import '../../css/Topic.css';
import { withRouter } from 'react-router';
import axios from 'axios';
import swal from 'sweetalert';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class Topic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numberDisplays: 0,
            numberComments: 0,
            likes: 0,
            vote: 0,
            isUpVoted: false,
            isDownVoted: false
        }
        this.Auth = new AuthService();
        
        this.onTopicClick = this.onTopicClick.bind(this);
        this.onUpVote = this.onUpVote.bind(this);
        this.onDownVote = this.onDownVote.bind(this);
        this.fetchTopicData = this.fetchTopicData.bind(this);
    }

    componentDidMount() {
        let jwtToken = this.Auth.getRightSocialToken();
        let topicId = this.props.id;

        fetch(`${BACKEND_API_URL}/get/topic/number/comments/${topicId}/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(jsonData => {
            this.setState({
                numberDisplays: jsonData.numberDisplay,
                numberComments: jsonData.numberComments,
                likes: jsonData.likes,
                vote: jsonData.vote
            }, () => {
                if(this.state.vote === 1) {
                    console.log(this.props.count);
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "red" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "white" });
                    this.setState({ 
                        isUpVoted: true,
                        isDownVoted: false
                    });
                } else if(this.state.vote === -1) {
                    console.log(this.props.count);
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "red" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "white" });
                    this.setState({ 
                        isDownVoted: true,
                        isUpVoted: false 
                    });
                } else {
                    console.log(this.props.count);
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "white" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "white" });
                    this.setState({ 
                        isDownVoted: false,
                        isUpVoted: false
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    onTopicClick(e) {
        e.preventDefault();
        this.props.history.push(`/topic/${this.props.id}/${this.props.languageForum}/posts`);
    }

    onUpVote() {
        let jwtToken = this.Auth.getRightSocialToken();
        if(!this.state.isUpVoted) {
            let isUpVoted = true;    
            axios({
                method: 'PUT',
                url: `${BACKEND_API_URL}/topic/likes/vote/${this.props.id}/${jwtToken}`,
                data: isUpVoted,
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            }).then(response => {
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                } else {
                    this.setState({
                        numberDisplays: 0,
                        numberComments: 0,
                        likes: 0,
                        isUpVoted: true,
                        isDownVoted: false
                    }, () => {
                        $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "red" });
                        $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "white"});
                        this.fetchTopicData();
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        } 
    }

    onDownVote() {
        let jwtToken = this.Auth.getRightSocialToken();
        if(!this.state.isDownVoted) {
            let isUpVoted = false;
            axios({
                method: 'PUT',
                url: `${BACKEND_API_URL}/topic/likes/vote/${this.props.id}/${jwtToken}`,
                data: isUpVoted,
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            }).then(response => {
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                } else {
                    this.setState({
                        numberDisplays: 0,
                        numberComments: 0,
                        likes: 0,
                        isDownVoted: true,
                        isUpVoted: false
                    }, () => {
                        $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "white" });
                        $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "red"});
                        this.fetchTopicData();
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    fetchTopicData() {
        let jwtToken = this.Auth.getRightSocialToken();
        let topicId = this.props.id;
        
        fetch(`${BACKEND_API_URL}/get/topic/number/comments/${topicId}/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'content-type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(jsonData => {
            this.setState({
                numberDisplays: jsonData.numberDisplay,
                numberComments: jsonData.numberComments,
                likes: jsonData.likes,
                vote: jsonData.vote
            }, () => {
                if(this.state.vote === 1) {
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "red" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "white" });
                    this.setState({ 
                        isUpVoted: true,
                        isDownVoted: false
                    });
                } else if(this.state.vote === -1) {
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "red" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "white" });
                    this.setState({ 
                        isDownVoted: true,
                        isUpVoted: false
                    });
                } else {
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(0) > i`).css({ "color": "white" });
                    $(`.grid-topic-one:eq(${this.props.count}) > div:eq(2) > i`).css({ "color": "white" });
                    this.setState({ 
                        isDownVoted: false,
                        isUpVoted: false
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return(
            <div className={`topic-container ${this.props.isLeft ? 'topic-container-border-left' : 'topic-container-border-right'}`}>
                <div className="topic-body">
                    <div className="grid-topic-one">
                        <div>
                            <i 
                                className="fas fa-chevron-circle-up like-icon"
                                onClick={this.onUpVote}
                            >
                            </i>
                        </div>
                        <div className="counter">
                            { this.state.likes }
                        </div>
                        <div>
                            <i 
                                className="fas fa-chevron-circle-down like-icon"
                                onClick={this.onDownVote}
                            >
                            </i>
                        </div>
                    </div>
                    <div className="grid-topic-two" onClick={this.onTopicClick}>
                        <div className="title-topic">
                            { this.props.title }
                        </div>
                        <div className="owner-topic">
                            <span className="floating-div">
                                { this.props.owner }
                            </span>

                            <span className="floating-div float-two-right">
                                {this.props.createdAt }
                            </span>

                            <div style={{ clear: 'both' }}></div>
                        </div>
                    </div>
                    <div className="grid-topic-three">
                        <div>
                            { this.state.numberComments } { this.props.t("forum.topic.comments") }
                            <br />
                            { this.state.numberDisplays } { this.props.t("forum.topic.display") }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation("common")(withRouter(Topic));