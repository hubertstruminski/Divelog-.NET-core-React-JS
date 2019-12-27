import React from 'react';
import { withTranslation } from 'react-i18next';
import swal from 'sweetalert';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';
import axios from 'axios';

class DeleteTableButton extends React.Component {
    constructor(props) {
        super(props);

        this.Auth = new AuthService();
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        let jwtToken = this.Auth.getRightSocialToken();
        let id = this.props.id;

        axios(`${BACKEND_API_URL}/logbook/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.status === 404) {
                swal(this.props.t("error-404.title"), this.props.t("error-404.message"),"error");
            } else if(response.status === 200) {
                this.props.setDeletedLogbookId(id);
                this.props.fetchLogbooks();
                swal("Success", "Record has been removed successfully.", "success");
            } else {
                swal("Error", "Bad Request. Something goes wrong.", "error");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <button 
                className="btn btn-danger"
                onClick={this.onClick}
            >
                {this.props.t("logbook.table.DELETE")}
            </button>
        );
    }
}

export default withTranslation("common")(DeleteTableButton);