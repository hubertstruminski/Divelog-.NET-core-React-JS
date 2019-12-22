import React from 'react';
import '../css/Header.css';

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="icon-container"> 
                <div className="icon-counter">7</div>
                <i class="fas fa-user-friends" style={{ "font-size": "20px"}}/>
            </div>
        );
    }
}

export default Friends;