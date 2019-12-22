import React from 'react';
import '../../../css/twitter-messages/Conversation.css';
import axios from 'axios';
import AuthService from '../../../util/AuthService';
import SingleMessage from './SingleMessage';
import $ from 'jquery';
import { BACKEND_API_URL } from '../../../actions/types';

class Conversation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingConversation: this.props.isLoadingConversation,
            directMessages: [],
            isSingleMessageRetrieved: false
        }
        this.Auth = new AuthService();
        this.renderSingleMessages = this.renderSingleMessages.bind(this);
    }

    componentDidMount() {
        const DM = {
            recipientId: this.props.recipientId,
            senderId: this.props.senderId
        }

        let jwtToken = this.Auth.getRightSocialToken();

        axios({
            url: `${BACKEND_API_URL}/twitter/direct/messages/specified/person/${jwtToken}`,
            method: 'POST',
            data: DM,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response.data);
            response.data.map((message, index) => {
                let urlEntities = [];
                let mediaEntities = [];

                message.urlEntities.map((urlEntity) => {
                    let element = urlEntity.expandedURL;
                    urlEntities.push(element);
                });

                message.mediaEntities.map((mediaEntity) => {
                    let element = {
                        mediaUrl: mediaEntity.mediaURL,
                        type: mediaEntity.type
                    }
                    mediaEntities.push(element);
                });
                const singleMessage = {
                    id: message.id,
                    createdAt: message.createdAt,
                    recipientId: message.recipientId,
                    senderId: message.senderId,
                    text: message.text,
                    mediaEntities: mediaEntities,
                    urlEntities: urlEntities,
                    twitterOwnerId: message.twitterOwnerId
                }
                this.setState({ directMessages: this.state.directMessages.concat(singleMessage) });
            });
            this.setState({ 
                isLoadingConversation: false,
                isSingleMessageRetrieved: true 
            }, () => {
                $(".twitter-messages-person-invite-wrapper").css({ "display": "block", "height": "92%" });
                $(".twitter-messages-list-inbox").css({ "max-height": "92%" })
            });
        }).catch(err => {
            console.log(err);
        });
    }

    renderSingleMessages() {
        return this.state.directMessages
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((singleMessage, index) => {
            return (
                <SingleMessage 
                    index={index}
                    id={singleMessage.id}
                    createdAt={singleMessage.createdAt}
                    recipientId={singleMessage.recipientId}
                    senderId={singleMessage.senderId}
                    text={singleMessage.text}
                    mediaEntities={singleMessage.mediaEntities}
                    urlEntities={singleMessage.urlEntities}
                    twitterOwnerId={singleMessage.twitterOwnerId}
                    pictureUrl={this.props.pictureUrl}
                />
            );
        });
    }

    render() {
        let isLoadingConversation = this.state.isLoadingConversation;
        let isSingleMessageRetrieved = this.state.isSingleMessageRetrieved;
        return (
            <>
                { isLoadingConversation &&
                    <div 
                        className='spinner-border text-primary' 
                        role='status'
                    >
                        <span class='sr-only'>
                            Loading...
                        </span>
                    </div>
                }
                {
                    !isLoadingConversation &&
                    <div className="twitter-messages-direct-message-person-conversation-wrapper">
                        <div className="twitter-messages-direct-message-person-title-info">
                            <div className="twitter-direct-message-screen-name-container">
                                <span style={{fontWeight: 700, fontSize: '1vw'}}>{ this.props.name }</span>
                                <br />
                                @{ this.props.screenName }
                            </div>
                            <div className="twitter-direct-message-info-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                        </div>
                        <div className="twitter-messages-direct-message-container">
                            {
                                isSingleMessageRetrieved && this.renderSingleMessages()
                            }
                        </div>
                        <div className="twitter-messages-direct-message-send-input-container">
                            <i class="fas fa-image"></i>
                            <textarea
                                placeholder="Start a new message"
                            ></textarea>
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default Conversation;