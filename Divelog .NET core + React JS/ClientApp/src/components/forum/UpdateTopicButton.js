import React from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

class UpdateTopicButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        let topicId = this.props.topicId;
        this.props.history.push(`/update/topic/${topicId}`);
    }

    render() {
        return (
            <button 
                className="btn btn-warning"
                onClick={this.onClick}
            >
                { this.props.t("forum.post.editBtn") }
            </button>
        );
    }
}

export default withTranslation("common")(withRouter(UpdateTopicButton));