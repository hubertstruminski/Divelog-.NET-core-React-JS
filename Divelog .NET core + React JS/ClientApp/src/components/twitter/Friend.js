import React from 'react';
import '../../css/Friend.css';

class Friend extends React.Component {
    render() {
        return (
            <div className="twitter-friend-item">
                <div className="twitter-friend-float-div twitter-friend-left-div">
                    <img 
                        src={this.props.pictureUrl} 
                        alt="Avatar" 
                        className="twitter-friend-avatar"
                    />
                </div>
                <div className="twitter-friend-float-div twitter-friend-right-div">{ this.props.name }</div>
            </div>
        );
    }
}

export default Friend;