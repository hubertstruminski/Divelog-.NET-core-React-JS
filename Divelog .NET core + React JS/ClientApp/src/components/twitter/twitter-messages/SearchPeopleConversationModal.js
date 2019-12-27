import React from 'react';
import '../../../css/twitter-messages/SearchPeopleConversationModal.css';
import AuthService from '../../../util/AuthService';
import TwitterConversationContact from './TwitterConversationContact';
import $ from 'jquery';
import TwitterMessagesSearch from './TwitterMessagesSearch';
import axios from 'axios';
import ContactModal from './ContactModal';
import SelectedContact from './SelectedContact';
import { BACKEND_API_URL } from '../../../actions/types';

class SearchPeopleConversationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            isLoading: false,
            searchInput: '',
            isContactsRetrieved: false,
            selectedContacts: []
        }
        this.Auth = new AuthService();
        this.renderContacts = this.renderContacts.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addSelectedContactToList = this.addSelectedContactToList.bind(this);
        this.renderSelectedContacts = this.renderSelectedContacts.bind(this);
        this.removeSelectedContactFromList = this.removeSelectedContactFromList.bind(this);
        this.checkThatContactIsSelected = this.checkThatContactIsSelected.bind(this);
    }

    onChange(e) {
        this.setState({ searchInput: e.target.value }, () => {
            if(this.state.searchInput && this.state.searchInput.length > 0) {
                this.setState({ isLoading: true }, () => {
                    this.retrieveContacts();
                });
            } else if(!this.state.searchPeople) {
                this.setState({ 
                    contacts: [],
                    isLoading: false
                });

            }
        });
    }

    onBlur(e) {
        if(this.state.searchInput.length === 0) {
            this.setState({ contacts: [] });
        }
    }

    retrieveContacts() {
        let jwtToken = this.Auth.getRightSocialToken();

        axios({
            url: `${BACKEND_API_URL}/twitter/direct/messages/search/people`,
            method: 'POST',
            data: JSON.stringify(this.state.searchInput),
            headers: {
                'Authorization': `${jwtToken}`,
                'content-type': 'application/json'
            }
        }).then(response => {
            this.setState({ contacts: [] });
            console.log(response.data);
            response.data.map((contact, index) => {
                const element = {
                    isContactPossible: contact.dmaccessible,
                    name: contact.name,
                    screenName: contact.screenName,
                    pictureUrl: contact.pictureUrl
                }
                this.setState({ contacts: this.state.contacts.concat(element) });
            });
            this.setState({ 
                isContactsRetrieved: true,
                isLoading: false
            }, () => {
                $(".twitter-messages-search-people-modal-list-contacts").css({ display: "block" });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    renderContacts() {
        return this.state.contacts.map((contact, index) => {
            return (
                <ContactModal 
                    key={index}
                    index={index}
                    isContactPossible={contact.isContactPossible}
                    name={contact.name}
                    screenName={contact.screenName}
                    pictureUrl={contact.pictureUrl}
                    addSelectedContactToList={this.addSelectedContactToList}
                    checkThatContactIsSelected={this.checkThatContactIsSelected}
                />
            );
        });  
    }

    onClose(e) {
        e.preventDefault();
        this.props.setIsNotVisibleModalToSearch();
    }

    checkThatContactIsSelected(selectedName) {
        let boolean = false;
        this.state.selectedContacts.map((contact, index) => {
            if(contact.name === selectedName) {
                boolean = true;
                return;
            }
        });
        return boolean;
    }

    addSelectedContactToList(object) {
        // let selectedContactsWrapper = $(".twitter-messages-selected-contacts").width();
        // let contactsListWrapper = $(".twitter-messages-search-people-modal-list-contacts").width();
        // let resultWidth = contactsListWrapper - selectedContactsWrapper;
        // $(".twitter-messages-search-people-modal-list-contacts").width(resultWidth);

        this.setState({ selectedContacts: this.state.selectedContacts.concat(object) });
    }

    removeSelectedContactFromList(name) {
        return this.state.selectedContacts.map((contact, index) => {
            if(contact.name === name) {
                this.setState({ selectedContacts: this.state.selectedContacts.filter((item, i) => i !== index) });
            }
        })
    }

    renderSelectedContacts() {
        return this.state.selectedContacts.map((contact, index) => {
            return (
                <SelectedContact 
                    name={contact.name}
                    removeSelectedContactFromList={this.removeSelectedContactFromList}
                />
            );
        });
    }

    render() {
        let isLoading = this.state.isLoading;
        let isContactsRetrieved = this.state.isContactsRetrieved;
        return (
            <div className="twitter-messages-search-people-conversation-modal">
                <div className="twitter-messages-search-people-conversation-header">
                    <div className="twitter-messages-search-people-header-left">
                        <i 
                            className="fa fa-times twitter-messages-search-people-modal-close"
                            onClick={this.onClose}
                        ></i>
                        <span style={{ color: 'black', fontWeight: 700, display: 'block', paddingLeft: '10%', width: '100%' }}>New message</span>
                    </div>
                    <div className="twitter-messages-search-people-header-right">
                        <button className="twitter-messages-search-people-modal-btn-next">Next</button>
                    </div>
                </div>
                <input 
                    className="twitter-messages-search-people-input" 
                    type="text" 
                    placeholder="Search people"
                    value={this.state.searchInput}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
                <div className="twitter-messages-selected-contacts">
                    { this.renderSelectedContacts() }
                </div>
                <div className="twitter-messages-search-people-info-icon-title">
                    <i className="fas fa-user twitter-messages-search-people-icon-user"></i> You follow each other
                </div>
                <div className="twitter-messages-search-people-modal-list-contacts">
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
                    {
                        isContactsRetrieved &&

                        <ul className="list-group">
                            { this.renderContacts() }
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export default SearchPeopleConversationModal;