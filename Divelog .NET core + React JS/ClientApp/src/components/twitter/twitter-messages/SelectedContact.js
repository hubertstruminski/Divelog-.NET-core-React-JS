import React from 'react';
import '../../../css/twitter-messages/SelectedContact.css';

class SelectedContact extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.removeSelectedContactFromList(this.props.name);
    }

    render() {
        return (
            <div className="twitter-messages-selected-contact-container">
                { this.props.name } 
                <div className="twitter-messages-selected-contact-icon-container">
                    
                </div>
                <i 
                    className="fa fa-times twitter-messages-selected-contact-close-btn"
                    onClick={this.onSubmit}
                ></i>
            </div>
        );
    }
}

export default SelectedContact;