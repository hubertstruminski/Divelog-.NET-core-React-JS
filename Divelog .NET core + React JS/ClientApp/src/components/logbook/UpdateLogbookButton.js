import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

class UpdateTableButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link to={`/update/logbook/${this.props.id}`}>
                <button className="btn btn-warning">
                    {this.props.t("logbook.table.UPDATE")}
                </button>
            </Link>
        );
    }
}

export default withTranslation("common")(UpdateTableButton);