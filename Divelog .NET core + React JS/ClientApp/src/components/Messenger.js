import React from 'react';
import '../css/Header.css';

class Messenger extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="icon-container"> 
                <div className="icon-counter">7</div>
                <i class="fab fa-facebook-messenger" style={{ "font-size": "20px"}}/>
            </div>
        );
    }
}

export default Messenger;