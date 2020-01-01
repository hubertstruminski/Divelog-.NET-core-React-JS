import React from 'react';
import '../../css/AddPosts.css';
import ReactFilestack from 'filestack-react';
import swal from 'sweetalert';
import axios from 'axios';
import { withRouter } from 'react-router';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class AddPosts extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            message: '',
            isInvalidMessage: false,
            successFiles: [],
            successNameFiles: [],
            isSuccessUploaded: false,
            isFailureUploaded: false,
            failureNameFiles: []
        }
        this.Auth = new AuthService();
        this.errors = [];

        this.onChange = this.onChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.responseFilestack = this.responseFilestack.bind(this);
        this.onErrorFilestack = this.onErrorFilestack.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    showInvalidMessage(isInvalidMessage) {
        if(isInvalidMessage) {
            return (
                <div className="alert alert-danger">
                    { this.props.t("forum.AddPosts.form.validation.invalidMessage") }
                </div>
            );
        }
        return null;
    }

    showSuccessUploadedFiles(isSuccessUploaded) {
        if(isSuccessUploaded) {
            return (
                <div className="alert alert-warning">
                    { this.props.t("forum.AddPosts.form.validation.successUploaded") }
                    { this.state.successNameFiles.map((name, index) => {
                        return <p>{name}</p>
                    })}
                </div>
            );
        }
        return null;
    }

    showFailureUploadedFiles(isFailureUploaded) {
        if(isFailureUploaded) {
            return (
                <div className="alert alert-danger">
                    { this.props.t("forum.AddPosts.form.validation.failureUploaded") }
                    { this.state.failureNameFiles.map((name, index) => {
                        return <p>{name}</p>
                    })}
                </div>
            );
        }
        return null;
    }

    validateForm(e) {
        if(this.state.message.length < 10) {
            e.preventDefault();
            this.setState({ isInvalidMessage: true });
            this.errors.push(true);
        }
    }

    onSubmitForm(e) {
        e.preventDefault();

        this.validateForm(e);

        if(this.errors.length === 0) {
            let jwtToken = this.Auth.getRightSocialToken();
            let topicId = this.props.topicId;

            const post = {
                message: this.state.message,
                topicId: topicId,
                files: this.state.successFiles,
            }

            axios({
                url: `${BACKEND_API_URL}/add/post`,
                method: 'POST',
                data: JSON.stringify(post),
                headers: {
                    'Authorization': `${jwtToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                } else {
                    $(".new-post-textarea").val("");
                    this.props.fetchTopicAndPosts();
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    responseFilestack(response) {
        response.filesUploaded.map((file, index) => {
            const element = {
                objectId: file.uploadId,
                url: file.url,
                size: file.size,
                name: file.originalFile.name,
                type: file.originalFile.type
            };
            this.setState({ 
                successFiles: this.state.successFiles.concat(element),
                successNameFiles: this.state.successNameFiles.concat(file.originalFile.name),
                isSuccessUploaded: true
            });
        });

        response.filesFailed.map((file, index) => {
            this.setState({ failureNameFiles: this.state.failureNameFiles.concat(file.originalFile.name) });
        });
    }

    onErrorFilestack() {
        swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
    }

    render() {
        return (
            <div className="add-post-center">
                <div className="new-post-box">
                    <div className="new-post-title">
                        { this.props.t("forum.AddPosts.form.title") }
                    </div>

                    <form onSubmit={this.onSubmitForm}>
                        <div className="form-group">
                            <label className="new-post-label" for="message">
                                { this.props.t("forum.AddPosts.form.labelMsg") }
                            </label>
                            <textarea
                                className="form-control form-control-lg new-post-textarea"
                                id="message"
                                name="message"
                                value={this.state.message}
                                onChange={this.onChange}
                                rows="5"
                                style={{ color: 'white' }}
                            >
                            </textarea>
                        </div>
                        { this.showInvalidMessage(this.state.isInvalidMessage) }

                        <div className="form-group">
                            <label className="new-post-label">
                                { this.props.t("forum.AddPosts.form.filestackBtn") }
                            </label>
                            <br />
                            <ReactFilestack
                                apikey="Abn3RoxlVQeWNtMpk2Gflz"
                                onSuccess={this.responseFilestack}
                                onError={this.onErrorFilestack}
                                componentDisplayMode={{
                                    type: 'button',
                                    customText: 'Upload files',
                                    customClass: 'btn btn-warning btn-upload'
                                }}
                            />
                            <div style={{ clear: "both" }}></div>
                            { this.showSuccessUploadedFiles(this.state.isSuccessUploaded) }
                            { this.showFailureUploadedFiles(this.state.isFailureUploaded) }
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary new-post-btn"
                        >
                            { this.props.t("forum.AddPosts.form.submit") }
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default withTranslation("common")(withRouter(AddPosts));