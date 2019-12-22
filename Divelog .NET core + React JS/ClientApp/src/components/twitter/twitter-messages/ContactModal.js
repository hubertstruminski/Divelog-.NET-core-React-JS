import React from 'react';
import '../../../css/twitter-messages/ContactModal.css';
import $ from 'jquery';

class ContactModal extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        if(this.props.isContactPossible) {
            const contact = {
                pictureUrl: this.props.pictureUrl,
                screenName: this.props.screenName,
                name: this.props.name
            }
            if(this.props.checkThatContactIsSelected(contact.name)) {
                e.preventDefault();
            } else {
                this.props.addSelectedContactToList(contact);
            }
        } else {
            e.preventDefault();
        }

    }

    render() {
        let isAllowedDM = ""
        if(!this.props.isContactPossible) {
            isAllowedDM = "can't be messaged";
            $(`.twitter-messages-contact-modal-container:eq(${this.props.index})`)
            .css({ "background-color": "#fcf5f5" });
        }

        return (
            <li className="twitter-messages-contact-modal-container" onClick={this.onSubmit}>
                <div className="twitter-messages-contact-modal-avatar">
                    <img src={this.props.pictureUrl} alt="Avatar" />
                </div>
                <div className="twitter-messages-contact-modal-info-container">
                    <div className="twitter-messages-contact-modal-info">
                        <span style={{ color: 'black', fontWeight: 700 }}>{ this.props.name }</span>
                        <br />
                        @{ this.props.screenName } { isAllowedDM }
                    </div>
                </div>
            </li>
        );
    }
}

export default ContactModal;