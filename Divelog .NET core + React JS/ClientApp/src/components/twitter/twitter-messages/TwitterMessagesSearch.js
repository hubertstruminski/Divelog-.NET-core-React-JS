import React from 'react';
import '../../../css/twitter-messages/TwitterMessagesSearch.css';

class TwitterMessagesSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchInput: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ searchInput: e.target.value }, () => {
            if(this.state.searchInput && this.state.searchInput.length > 0) {
                this.props.searchInList(this.state.searchInput);
            } else if(!this.state.searchInput) {
                this.props.setIsConversationRetrieved(false)
                this.props.retrieveConversations();
            } 
        });
    }

    render() {
        return (
            <div className="twitter-messages-search-input-container">
                <input 
                    className="twitter-messages-search-input" 
                    type="text" 
                    placeholder="Search for people and groups"
                    value={this.state.searchInput}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default TwitterMessagesSearch;