import React from 'react';
import $ from 'jquery';
import swal from 'sweetalert';
import { withTranslation } from 'react-i18next';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';
import axios from 'axios';

class GoogleModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        }
        this.Auth = new AuthService();

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        let name = $("#name").val();

        const googleMarker = {
            Name: name,
            Latitude: this.props.latitude,
            Longitude: this.props.longitude
        }

        let jwtToken = this.Auth.getRightSocialToken();

        axios(`${BACKEND_API_URL}/add/marker`, {
            method: 'POST',
            headers: {
                'Authorization': `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(googleMarker)
        }).then(response => {
            if(response.status === 200) {
                this.props.setFinishMarker();
                this.props.addMarkerToArray(googleMarker);
                this.props.fetchMarkers();
                $("#modalCenter").modal('hide');
            } else if(response.status === 404) {
                swal(this.props.t("error-404.title"), this.props.t("error-404.message"),"error");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="modal fade" id="modalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">
                            {this.props.t("googleMap.modal.title")}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">
                                {this.props.t("googleMap.modal.text")}
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                className="form-control" 
                                value={this.state.name}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">
                            {this.props.t("googleMap.modal.close")}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success"
                            onClick={this.onSubmit}
                        >
                            {this.props.t("googleMap.modal.save")}
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation("common")(GoogleModal);