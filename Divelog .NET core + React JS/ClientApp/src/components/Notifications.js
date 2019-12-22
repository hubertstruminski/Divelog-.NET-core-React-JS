import React from 'react';
import '../css/Header.css';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="icon-container"> 
                <div className="icon-counter">112</div>
                <i class="fas fa-bell" style={{ "font-size": "1vw"}}/>
            </div>
        );
    }
}

export default Notifications;