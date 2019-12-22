import React from 'react';
import { withTranslation } from 'react-i18next';
import swal from 'sweetalert';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);

        this.Auth = new AuthService();
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        let markerID = this.props.id;
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/delete/marker/${jwtToken}/${markerID}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.status === 404) {
                swal(this.props.t("error-404.title"), this.props.t("error-404.message"),"error");
            } else if(response.status === 400) {
                swal("No access", "You can not remove marker assigned to dive from logbook.", "error");
            } else {
                swal("Success", "Record has been removed successfully.", "success");
                this.props.setDeletedMarkerId(markerID);
                this.props.fetchMarkers();
            }
        }).catch(err => {
            console.log(err);
        });
        this.props.setIsDeletedMarker();
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

export default withTranslation("common")(DeleteButton);