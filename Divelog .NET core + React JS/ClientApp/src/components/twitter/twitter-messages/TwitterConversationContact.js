import React from 'react';
import '../../../css/twitter-messages/TwitterConversationContact.css';
import axios from 'axios';
import ConvertDMTime from '../../../util/ConvertDMTime';

class TwitterConversationContact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.convertTime = new ConvertDMTime();
    }
    // formatDate(inputDate) {
    //     let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "June.", "July.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

    //     let date = new Date(inputDate);
    //     let splittedDate = date.toString().split(" ");

    //     let year = date.getFullYear();
    //     let indexOfMonth = date.getMonth();
    //     let month = months[indexOfMonth];
    //     let days = splittedDate[2];
    //     let hours = date.getHours();
    //     let minutes = date.getMinutes();

    //     let currentDate = new Date();
    //     let splittedCurrentDate = currentDate.toString().split(" ");

    //     if(year === currentDate.getFullYear() && indexOfMonth === currentDate.getMonth() && days === splittedCurrentDate[2]) {
    //         if(hours < 10) {
    //             hours = "0" + hours;
    //         }
    //         if(minutes < 10) {
    //             minutes = "0" + minutes;
    //         }
    //         return hours + ":" + minutes;
    //     }

    //     if(year === currentDate.getFullYear()) {
    //         return month + " " + days;
    //     }

    //     if(days < 10) {
    //         days = "0" + days;
    //     }

    //     indexOfMonth = indexOfMonth + 1;

    //     if(indexOfMonth < 10) {
    //         indexOfMonth = "0" + indexOfMonth;
    //     }
    //     return days + "-" + indexOfMonth + "-" + year;   
    // }

    onSubmit(e) {
        e.preventDefault();
        this.props.setIsLoadingConversation(
            true,
            this.props.recipientId,
            this.props.senderId,
            this.props.name,
            this.props.screenName,
            this.props.pictureUrl 
        );
    }

    render() {
        let text = "";
        if(this.props.text.length > 40) {
            text = this.props.text.substring(0, 40);
        } else {
            text = this.props.text.substring(0);
        }

        let date = this.convertTime.formatDate(this.props.createdAt, false);

        return (
            <li className="conversation-contact-wrapper" onClick={this.onSubmit.bind(this)}>
                <div className="conversation-contact-avatar">
                    <img src={this.props.pictureUrl} alt="Avatar" />
                </div>
                <div className="conversation-contact-info">
                    <div className="conversation-contact-name">
                        {this.props.name}
                    </div>
                    <div className="conversation-contact-date">{date}</div>
                    <br />
                    @{ this.props.screenName }
                    <br />
                    { text }
                </div>
                    
            </li>
        );
    }
}

export default TwitterConversationContact;