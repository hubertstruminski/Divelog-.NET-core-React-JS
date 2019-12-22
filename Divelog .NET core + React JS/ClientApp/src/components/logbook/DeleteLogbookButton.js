import React from 'react';
import { withTranslation } from 'react-i18next';

class DeleteLogbookButton extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        const markerObject = {
            name: '',
            latitude: '',
            longitude: ''
        }
        this.props.updateMarker(markerObject);
        this.props.setMarker(markerObject);
        this.props.setIsAccessible();
        this.props.setFinishMarker(false);

        if(this.props.isUpdating) {
            this.props.setUpdateLogbookRow();
        }
    }

    render() {
        return (
            <button
                className="btn btn-danger"
                onClick={this.onSubmit}
            >
                {this.props.t("googleMap.table.delete")}
            </button>
        );
    }
}

export default withTranslation("common")(DeleteLogbookButton);