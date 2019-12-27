import React from 'react';
import '../../../css/twitter-messages/TwitterMessagesInbox.css';
import AuthService from '../../../util/AuthService';
import TwitterConversationContact from './TwitterConversationContact';
import $ from 'jquery';
import TwitterMessagesSearch from './TwitterMessagesSearch';
import Conversation from './Conversation';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterMessagesInbox extends React.Component {
    constructor() {
        super();

        this.state = {
            conversations: [],
            isConversationsRetrieved: false,
            copyOfConversations: [],
            isLoading: true,
            isLoadingConversation: false,
            recipientId: '',
            senderId: '',
            isConversationClicked: false,
            name: '',
            screenName: '',
            pictureUrl: ''
        }
        this.Auth = new AuthService();
        this.copyOfConversations = [];
        this.renderConversations = this.renderConversations.bind(this);
        this.searchInList = this.searchInList.bind(this);
        this.retrieveConversations = this.retrieveConversations.bind(this);
        this.setIsConversationRetrieved = this.setIsConversationRetrieved.bind(this);
        this.searchPeopleToConversation = this.searchPeopleToConversation.bind(this);
        this.setIsLoadingConversation = this.setIsLoadingConversation.bind(this);
    }

    componentDidMount() {
        $(".twitter-messages-list-inbox").css({ "max-height": "100%" });
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/twitter/direct/messages`, {
            method: 'GET',
            headers: {
                'Authorization': `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(json => {
            json.map((item, index) => {
                const element = {
                    recipientId: item.recipientId,
                    senderId: item.senderId,
                    name: item.name,
                    screenName: item.screenName,
                    createdAt: item.createdAt,
                    text: item.text,
                    pictureUrl: item.pictureUrl
                }
                this.setState({ conversations: this.state.conversations.concat(element) });
            });
            this.setState({ isConversationsRetrieved: true }, () => {
                this.setState({ isLoading: false });
                this.copyOfConversations = this.state.conversations.map((x) => x);
                $(".twitter-messages-list-persons-spinner").css({ display: "block" });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    renderConversations() {
        return this.state.conversations
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((conversation, index) => {
            return (
                <TwitterConversationContact 
                    recipientId={conversation.recipientId}
                    senderId={conversation.senderId}
                    name={conversation.name}
                    screenName={conversation.screenName}
                    createdAt={conversation.createdAt}
                    text={conversation.text}
                    pictureUrl={conversation.pictureUrl}
                    setIsLoadingConversation={this.setIsLoadingConversation}
                />
            );
        });
    }

    searchInList(searchInput) {
        this.setState({ 
            isConversationsRetrieved: true,
            conversations: this.copyOfConversations.map((x) => x)
        
        }, () => {
            return this.state.conversations.map((conversation, index) => {
                if(conversation.name.includes(searchInput) || conversation.screenName.includes(searchInput)) {
                    this.setState({ conversations: this.state.conversations.filter((item, i) => i === index)});
                }
            });
        });
        return null;
    }

    retrieveConversations() {
        return this.copyOfConversations
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((conversation, index) => {
            return (
                <TwitterConversationContact 
                    recipientId={conversation.recipientId}
                    senderId={conversation.senderId}
                    name={conversation.name}
                    screenName={conversation.screenName}
                    createdAt={conversation.createdAt}
                    text={conversation.text}
                    pictureUrl={conversation.pictureUrl}
                    setIsLoadingConversation={this.setIsLoadingConversation}
                />
            );
        });
    }

    searchPeopleToConversation(e) {
        e.preventDefault();
        this.props.searchPeopleToConversation();
    }

    setIsConversationRetrieved(value) {
        this.setState({ isConversationsRetrieved: value });
    }

    setIsLoadingConversation(value, recipient, sender, name, screenName, pictureUrl) {
        this.setState({ 
            isConversationClicked: true,
            isLoadingConversation: value,
            recipientId: recipient,
            senderId: sender,
            name: name,
            screenName: screenName,
            pictureUrl: pictureUrl
        });
    }

    render() {
        let isConversationsRetrieved = this.state.isConversationsRetrieved;
        let isLoading = this.state.isLoading;
        let isConversationClicked = this.state.isConversationClicked;
        return (
            <div className="twitter-messages-inbox-container">
                <div className="twitter-messages-list-inbox">
                    <div className="twitter-messages-title-box">
                        <div className="twitter-messages-title">Messages</div>
                        <i 
                            className="far fa-envelope twitter-messages-add-icon" 
                            onClick={this.searchPeopleToConversation}
                        ></i>
                    </div>
                    <TwitterMessagesSearch 
                        searchInList={this.searchInList}
                        retrieveConversations={this.retrieveConversations}
                        setIsConversationRetrieved={this.setIsConversationRetrieved}
                    />
                    <div className="twitter-messages-list-persons-spinner">
                        <ul className="list-group">
                            { isConversationsRetrieved && this.renderConversations() }
                            { !isConversationsRetrieved && this.retrieveConversations() }
                        </ul>
                        { isLoading &&
                            <div 
                                className='spinner-border text-primary' 
                                role='status'
                            >
                                <span class='sr-only'>
                                    Loading...
                                </span>
                            </div>
                        }
                    </div>
                </div>
                <div className="twitter-messages-person-invite-wrapper">
                    { !isConversationClicked &&
                        <div className="twitter-messages-person-invite">
                            <span style={{ fontWeight: 700, fontSize: '1.1vw' }}>You don't have a message selected</span>
                            <br />
                            Choose one from your existing messages, or start a new one.
                            <br />
                            <button 
                                className="twitter-message-person-btn-new-message"
                                onClick={this.searchPeopleToConversation}
                            >
                                New message
                            </button>
                        </div>
                    }
                    { isConversationClicked &&
                        <Conversation 
                            recipientId={this.state.recipientId}
                            senderId={this.state.senderId}
                            pictureUrl={this.state.pictureUrl}
                            isLoadingConversation={this.state.isLoadingConversation}
                            name={this.state.name}
                            screenName={this.state.screenName}
                        />
                    }
                </div>                
            </div>
        );
    }
}

export default TwitterMessagesInbox;