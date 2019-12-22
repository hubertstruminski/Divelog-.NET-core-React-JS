import React from 'react';
import '../../css/Trend.css';

class Trend extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="twitter-trend-container">
                Trending in {this.props.countryName}
                <br />
                <span style={{ color: 'black', fontWeight: '700' }}>{this.props.name}</span>
                <br />
                {this.props.tweetVolume}K Tweets
            </div>
        );
    }
}

export default Trend