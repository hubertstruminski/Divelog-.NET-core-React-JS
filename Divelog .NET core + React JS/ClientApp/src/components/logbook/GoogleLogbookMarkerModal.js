import React from 'react';
import { withTranslation } from 'react-i18next';
import $ from 'jquery';
import swal from 'sweetalert';

class GoogleLogbookMarkerModal extends React.Component {
    constructor(props) {
        super(props);

        this.onCancelSubmit = this.onCancelSubmit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        try {
            const googleMarker = {
                name: this.props.name,
                latitude: this.props.latitude,
                longitude: this.props.longitude
            }
            this.props.updateMarker(googleMarker);
            this.props.setMarker(googleMarker);
            this.props.setFinishMarker(true);
            $("#modalLogbookMarker").modal('hide');
        } catch(error) {
            swal(this.props.t("googleMap.modal.swalError.title"), this.props.t("googleMap.modal.swalError.text"), "error");
        }
    }

    onCancelSubmit() {
        this.props.setIsAccessible();
    }

    render() {
        return (
            <div className="modal fade" id="modalLogbookMarker" tabIndex="-1" role="dialog" aria-labelledby="modalMarker" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalMarker">
                            {this.props.t("googleMap.markerModal.title")}
                        </h5>
                        <button 
                            type="button" 
                            className="close" 
                            data-dismiss="modal" 
                            aria-label="Close"
                            onClick={this.onCancelSubmit}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.props.t("googleMap.markerModal.text")}
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-danger" 
                            data-dismiss="modal"
                            onClick={this.onCancelSubmit}
                        >
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

export default withTranslation("common")(GoogleLogbookMarkerModal);