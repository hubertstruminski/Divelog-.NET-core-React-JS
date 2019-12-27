import React from 'react';
import '../../css/AddDive.css';
import GoogleLogbookMap from './GoogleLogbookMap';
import AuthService from '../../util/AuthService';
import axios from 'axios';
import { withRouter } from 'react-router';
import swal from 'sweetalert'; 
import $ from 'jquery';  
import { withTranslation } from 'react-i18next';
import ConvertTime from '../../util/ConvertTime';
import { BACKEND_API_URL } from '../../actions/types';

class UpdateLogbook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partnerName: '',
            partnerSurname: '',
            marker: {},
            entryTime: '',
            exitTime: '',
            averageDepth: 0.0,
            maxDepth: 0.0,
            visibility: 0.0,
            waterTemperature: 0.0,
            airTemperature: 0.0,
            cylinderCapacity: '',
            divingSuit: 'NONE',
            waterType: 'NONE',
            waterEntryType: 'NONE',
            ballast: 0.0,
            glovesType: 'NONE',
            divingType: 'NONE',
            comment: '',
            partnerNameValidator: false,
            partnerSurnameValidator: false,
            visibilityValidator: false,
            markerValidator: false,
            maxDepthValidator: false
        }
        this.Auth = new AuthService();

        this.validator = [];

        this.onChange = this.onChange.bind(this);
        this.setMarker = this.setMarker.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.ConvertTime = new ConvertTime();
    }

    componentDidMount() {
        let logbookId = this.props.match.params.id;
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/get/logbook/${logbookId}`, {
            method: 'GET',
            headers: {
                "Authorization": `${jwtToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => { return response.json() })
        .then(jsonData => {
            let time = this.ConvertTime.convertTime(jsonData.entryTime, jsonData.exitTime, true);

            const markerElement = {
                id: jsonData.marker.id,
                name: jsonData.marker.name,
                latitude: jsonData.marker.latitude,
                longitude: jsonData.marker.longitude
            }

            this.setState({
                partnerName: jsonData.partnerName,
                partnerSurname: jsonData.partnerSurname,
                marker: markerElement,
                entryTime: time[0],
                exitTime: time[1],
                averageDepth: jsonData.averageDepth,
                maxDepth: jsonData.maxDepth,
                visibility: jsonData.visibility,
                waterTemperature: jsonData.waterTemperature,
                airTemperature: jsonData.airTemperature,
                cylinderCapacity: jsonData.cylinderCapacity,
                divingSuit: jsonData.divingSuit,
                waterType: jsonData.waterType,
                waterEntryType: jsonData.waterEntryType,
                ballast: jsonData.ballast,
                glovesType: jsonData.glovesType,
                divingType: jsonData.divingType,
                comment: jsonData.comment
            });
        }).catch(err => {
            console.log(err);
        });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    setMarker(newMarker) {
        this.setState({ marker: newMarker });
    }

    validateForm(e) {
        if(this.state.partnerName.length > 60) {
            this.setState({ partnerNameValidator: true });
            this.validator.push(true);
            e.preventDefault();
        } else {
            if(this.state.partnerNameValidator === true) {
                this.setState({ partnerNameValidator: false });
            }
        }

        if(this.state.partnerSurname.length > 100) {
            this.setState({ partnerSurnameValidator: true });
            this.validator.push(true);
            e.preventDefault();
        } else {
            if(this.state.partnerSurnameValidator === true) {
                this.setState({ partnerSurameValidator: false });
            }
        }

        if(this.state.maxDepth === 0.0) {
            this.setState({ maxDepthValidator: true });
            this.validator.push(true);
            e.preventDefault();
        } else {
            if(this.state.maxDepthValidator === true) {
                this.setState({ maxDepthValidator: false });
            }
        }

        if(this.state.visibility === 0.0) {
            this.setState({ visibilityValidator: true });
            this.validator.push(true);
            e.preventDefault();
        } else {
            if(this.state.visibilityValidator === true) {
                this.setState({ visibilityValidator: false });
            }
        }

        if($.isEmptyObject(this.state.marker)) {
            this.setState({ markerValidator: true });
            this.validator.push(true);
            e.preventDefault();
        } else {
            if(this.state.markerValidator === true) {
                this.setState({ markerValidator: false });
            }
        }

        for(let property in this.state.marker) {
            console.log(this.state.marker[property]);
            if(this.state.marker[property] === '') {
                this.setState({ markerValidator: true });
                this.validator.push(true);
                e.preventDefault();
            } else {
                if(this.state.markerValidator === true) {
                    this.setState({ markerValidator: false });
                }
            }
        }
    }

    showInvalidPartnerName(partnerNameValidator) {
        if(partnerNameValidator) {
            return (
                <div className="alert alert-danger">
                    {this.props.t("addDive.invalidPartnerName")}
                </div>
            );
        }
        return null;
    }
    
    showInvalidPartnerSurname(partnerSurnameValidator) {
        if(partnerSurnameValidator) {
            return (
                <div className="alert alert-danger">
                    {this.props.t("addDive.invalidPartnerSurname")}
                </div>
            );
        }
        return null;
    }
    
    showInvalidMaxDepth(maxDepthValidator) {
        if(maxDepthValidator) {
            return (
                <div className="alert alert-danger">
                    {this.props.t("addDive.invalidMaxDepth")}
                </div>
            );
        }
        return null;
    }
    
    showInvalidVisibility(visibilityValidator) {
        if(visibilityValidator) {
            return (
                <div className="alert alert-danger">
                    {this.props.t("addDive.invalidVisibility")}
                </div>
            );
        }
        return null;
    }
    
    showInvalidMarker(markerValidator) {
        if(markerValidator) {
            return (
                <div className="alert alert-danger">
                    {this.props.t("addDive.invalidMarker")}
                </div>
            );
        }
        return null;
    }

    onSubmit(e) {
        e.preventDefault();

        this.validator = [];

        this.validateForm(e);
        
        if(this.validator.length === 0) {
            let jwtToken = this.Auth.getRightSocialToken();
            let logbookId = this.props.match.params.id;
            
            const logbookObject = {
                partnerName: this.state.partnerName,
                partnerSurname: this.state.partnerSurname,
                marker: this.state.marker,
                entryTime: this.state.entryTime,
                exitTime: this.state.exitTime,
                averageDepth: this.state.averageDepth,
                maxDepth: this.state.maxDepth,
                visibility: this.state.visibility,
                waterTemperature: this.state.waterTemperature,
                airTemperature: this.state.airTemperature,    
                cylinderCapacity: this.state.cylinderCapacity,
                divingSuit: this.state.divingSuit,
                waterType: this.state.waterType,
                waterEntryType: this.state.waterEntryType,
                ballast: this.state.ballast,
                glovesType: this.state.glovesType,
                divingType: this.state.divingType,
                comment: this.state.comment
            }

            axios({
                method: 'PUT',
                url: `${BACKEND_API_URL}/edit/logbook/${logbookId}`,
                data: JSON.stringify(logbookObject),
                headers: {
                    "Authorization": `${jwtToken}`,
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            }).then(response => {
                if(response.status === 404) {
                    swal(this.props.t("error-404.title"), this.props.t("error-404.message"),"error");
                } else if(response.status === 200) {
                    this.props.history.push("/logbook");
                } else {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                }
            }).catch(err => {
                console.log(err);
            });
        }   
    }

    render() {
        return (
            <div className="add-dive-container">
                <div className="add-dive-center">
                    <div className="add-dive-box dive-shadow">
                        <div className="add-dive-title">
                            {this.props.t("addDive.form.title")}
                        </div>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="partnerName">
                                    {this.props.t("addDive.form.partnerName")}
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    id="partnerName" 
                                    placeholder="Enter partner's name"
                                    name="partnerName"
                                    value={this.state.partnerName}
                                    onChange={this.onChange}
                                />
                            </div>
                            { this.showInvalidPartnerName(this.state.partnerNameValidator) }

                            <div className="form-group">
                                <label htmlFor="partnerSurname">
                                    {this.props.t("addDive.form.partnerSurname")}
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    id="partnerSurname" 
                                    placeholder="Enter partner's surname" 
                                    name="partnerSurname"
                                    value={this.state.partnerSurname}
                                    onChange={this.onChange}
                                />
                            </div>
                            { this.showInvalidPartnerSurname(this.state.partnerSurnameValidator) }

                            <div className="form-group row">
                                <label htmlFor="entryTime" className="col-sm-2 col-form-label">
                                    {this.props.t("addDive.form.entryTime")}
                                </label>
                                <div className="col-sm-10">
                                    <input 
                                        type="datetime-local" 
                                        className="form-control" 
                                        id="entryTime"
                                        name="entryTime"
                                        value={this.state.entryTime}
                                        onChange={this.onChange} 
                                    />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="exitTime" className="col-sm-2 col-form-label">
                                    {this.props.t("addDive.form.exitTime")}
                                </label>
                                <div className="col-sm-10">
                                    <input 
                                        type="datetime-local" 
                                        className="form-control" 
                                        id="exitTime" 
                                        name="exitTime"
                                        value={this.state.exitTime}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="avgDepth">
                                    {this.props.t("addDive.form.avgDepth")} [m]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    className="form-control" 
                                    id="avgDepth" 
                                    name="averageDepth"
                                    value={this.state.averageDepth}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="maxDepth">
                                    {this.props.t("addDive.form.maxDepth")} [m]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="form-control" 
                                    id="maxDepth" 
                                    name="maxDepth"
                                    value={this.state.maxDepth}
                                    onChange={this.onChange}
                                />
                            </div>
                            { this.showInvalidMaxDepth(this.state.maxDepthValidator) }

                            <div className="form-group">
                                <label htmlFor="visibility">
                                    {this.props.t("addDive.form.visibility")} [m]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="0" 
                                    className="form-control" 
                                    id="visibility" 
                                    name="visibility"
                                    value={this.state.visibility}
                                    onChange={this.onChange}
                                />
                            </div>
                            { this.showInvalidVisibility(this.state.visibilityValidator) }
                            
                            <div className="form-group">
                                <label htmlFor="waterTemperature">
                                    {this.props.t("addDive.form.waterTemperature")} [<sup>o</sup>C]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="-5" 
                                    className="form-control" 
                                    id="waterTemperature" 
                                    name="waterTemperature"
                                    value={this.state.waterTemperature}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="airTemperature">
                                    {this.props.t("addDive.form.airTemperature")} [<sup>o</sup>C]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="-100" 
                                    className="form-control" 
                                    id="airTemperature" 
                                    name="airTemperature"
                                    value={this.state.airTemperature}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-5">
                                    <label htmlFor="cylinder">
                                        {this.props.t("addDive.form.cylinderCapacity.title")}
                                    </label>
                                    <select 
                                        id="cylinder"
                                        className="custom-select mr-sm-2"
                                        name="cylinderCapacity"
                                        value={this.state.cylinderCapacity}
                                        onChange={this.onChange}
                                    >
                                        <option value="NONE">
                                        {this.props.t("addDive.form.cylinderCapacity.options.NONE")}
                                        </option>
                                        <option value="10L">10L</option>
                                        <option value="12L">12L</option>
                                        <option value="15L">15L</option>
                                        <option value="18L">18L</option>
                                        <option value="TWINSET">
                                            {this.props.t("addDive.form.cylinderCapacity.options.TWINSET")}
                                        </option>
                                        <option value="REBREATHER">
                                            {this.props.t("addDive.form.cylinderCapacity.options.REBREATHER")}
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group col-md-3">
                                    <label htmlFor="suit">
                                        {this.props.t("addDive.form.suit.title")}
                                    </label>
                                    <select 
                                        id="suit"
                                        name="divingSuit"
                                        className="custom-select mr-sm-2"
                                        value={this.state.divingSuit}
                                        onChange={this.onChange}
                                    >
                                        <option value="NONE">
                                            {this.props.t("addDive.form.suit.options.NONE")}
                                        </option>
                                        <option value="DRY">
                                            {this.props.t("addDive.form.suit.options.DRY")}
                                        </option>
                                        <option value="SEMIARID">
                                            {this.props.t("addDive.form.suit.options.SEMIARID")}
                                        </option>
                                        <option value="WET">
                                            {this.props.t("addDive.form.suit.options.WET")}
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group col-md-4">
                                    <label htmlFor="waterType">
                                        {this.props.t("addDive.form.waterType.title")}
                                    </label>
                                    <select 
                                        id="waterType"
                                        className="custom-select mr-sm-2"
                                        name="waterType"
                                        value={this.state.waterType}
                                        onChange={this.onChange}
                                    >
                                        <option value="NONE">
                                            {this.props.t("addDive.form.waterType.options.NONE")}
                                        </option>
                                        <option value="SWEET">
                                            {this.props.t("addDive.form.waterType.options.SWEET")}
                                        </option>
                                        <option value="SALT">
                                            {this.props.t("addDive.form.waterType.options.SALT")}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="waterEntryType">
                                        {this.props.t("addDive.form.waterEntryType.title")}
                                    </label>
                                    <select  
                                        id="waterEntryType"
                                        name="waterEntryType"
                                        className="custom-select mr-sm-2"
                                        value={this.state.waterEntryType}
                                        onChange={this.onChange}
                                    >
                                        <option value="NONE">
                                            {this.props.t("addDive.form.waterEntryType.options.NONE")}
                                        </option>
                                        <option value="COAST">
                                            {this.props.t("addDive.form.waterEntryType.options.COAST")}
                                        </option>
                                        <option value="BOAT">
                                            {this.props.t("addDive.form.waterEntryType.options.BOAT")}
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="glovesType">
                                        {this.props.t("addDive.form.glovesType.title")}
                                    </label>
                                    <select 
                                        id="glovesType"
                                        name="glovesType"
                                        className="custom-select mr-sm-2"
                                        value={this.state.glovesType}
                                        onChange={this.onChange}
                                    >
                                        <option value="NONE">
                                            {this.props.t("addDive.form.glovesType.options.NONE")}
                                        </option>
                                        <option value="WET">
                                            {this.props.t("addDive.form.glovesType.options.WET")}
                                        </option>
                                        <option value="DRY">
                                            {this.props.t("addDive.form.glovesType.options.DRY")}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="ballast">
                                    {this.props.t("addDive.form.ballast")} [kg]
                                </label>
                                <input 
                                    type="number" 
                                    step="0.5" 
                                    min="0" 
                                    className="form-control" 
                                    id="ballast"
                                    name="ballast"
                                    value={this.state.ballast}
                                    onChange={this.onChange} 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="divingType">
                                    {this.props.t("addDive.form.divingType.title")}
                                </label>
                                <select 
                                    id="divingType"
                                    name="divingType"
                                    className="custom-select mr-sm-2"
                                    value={this.state.divingType}
                                    onChange={this.onChange}
                                >
                                    <option value="NONE">
                                        {this.props.t("addDive.form.divingType.options.NONE")}
                                    </option>
                                    <option value="RECREATIONAL">
                                        {this.props.t("addDive.form.divingType.options.Recreational")}
                                    </option>
                                    <option value="TECHNICAL">
                                        {this.props.t("addDive.form.divingType.options.Technical")}
                                    </option>
                                    <option value="CAVE">
                                        {this.props.t("addDive.form.divingType.options.Cave")}
                                    </option>
                                    <option value="WRECK">
                                        {this.props.t("addDive.form.divingType.options.Wreck")}
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="googleLogbookMap">
                                    {this.props.t("addDive.form.location")}
                                </label>
                                <GoogleLogbookMap 
                                    setMarker={this.setMarker}
                                    updateMarker={this.state.marker}
                                />
                            </div>
                            { this.showInvalidMarker(this.state.markerValidator) }

                            <div className="form-group">
                                <label htmlFor="comment">
                                    {this.props.t("addDive.form.comment")}
                                </label>
                                <textarea 
                                    className="form-control" 
                                    id="comment" 
                                    rows="7"
                                    name="comment"
                                    value={this.state.comment}
                                    onChange={this.onChange}
                                >
                                </textarea>
                            </div>

                            <div className="btn-add-dive-center">
                                <button type="submit" className="btn btn-primary btn-lg btn-add-dive">
                                    {this.props.t("addDive.form.button")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation("common")(withRouter(UpdateLogbook));