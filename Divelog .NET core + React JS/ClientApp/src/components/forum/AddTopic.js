import React from 'react';
import '../../css/AddTopic.css';
import ReactFilestack from 'filestack-react';
import swal from 'sweetalert';
import axios from 'axios';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class AddTopic extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            title: '',
            message: '',
            isInvalidTitle: false,
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

    showInvalidTitle(isInvalidTitle) {
        if(isInvalidTitle) {
            return (
                <div className="alert alert-danger">
                    { this.props.t("forum.AddTopic.form.validation.invalidTitle") }
                </div>
            );
        }
        return null;
    }

    showInvalidMessage(isInvalidMessage) {
        if(isInvalidMessage) {
            return (
                <div className="alert alert-danger">
                    { this.props.t("forum.AddTopic.form.validation.invalidMessage") }
                </div>
            );
        }
        return null;
    }

    showSuccessUploadedFiles(isSuccessUploaded) {
        if(isSuccessUploaded) {
            return (
                <div className="alert alert-warning">
                    { this.props.t("forum.AddTopic.form.validation.successUploaded") }
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
                    { this.props.t("forum.AddTopic.form.validation.failureUploaded") }
                    { this.state.failureNameFiles.map((name, index) => {
                        return <p>{name}</p>
                    })}
                </div>
            );
        }
        return null;
    }

    validateForm(e) {
        if(this.state.title.length < 10 || this.state.title.length > 160) {
            e.preventDefault();
            this.setState({ isInvalidTitle: true });
            this.errors.push(true);
        }

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
            let forumType = this.props.match.params.selectedForum;

            const topicDto = {
                title: this.state.title,
                message: this.state.message,
                likes: 0,
                languageForum: forumType,
                files: this.state.successFiles
            }

            axios({
                url: `${BACKEND_API_URL}/add/topic`,
                method: 'POST',
                data: JSON.stringify(topicDto),
                headers: {
                    'Authorization': `${jwtToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response);
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                } else {
                    this.props.history.push("/forum");
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
            <div className="add-topic-container add-topic-center">
                <div className="new-topic-box">
                    <div className="new-topic-title">
                        { this.props.t("forum.AddTopic.form.title") }
                    </div>

                    <form onSubmit={this.onSubmitForm}>
                        <div className="form-group">
                            <label for="title">
                                { this.props.t("forum.AddTopic.form.labelTitle") }
                            </label>
                            <input 
                                className="form-control form-control-lg new-update-topic-inputs"
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                value={this.state.title}
                                onChange={this.onChange}
                                style={{ color: 'white' }}
                            />
                        </div>
                        { this.showInvalidTitle(this.state.isInvalidTitle) }

                        <div className="form-group">
                            <label for="message">
                                { this.props.t("forum.AddTopic.form.labelMsg") }
                            </label>
                            <textarea
                                className="form-control form-control-lg new-update-topic-inputs"
                                id="message"
                                name="message"
                                value={this.state.message}
                                onChange={this.onChange}
                                rows="17"
                                style={{ color: 'white' }}
                            >
                            </textarea>
                        </div>
                        { this.showInvalidMessage(this.state.isInvalidMessage) }

                        <div className="form-group">
                            <label>
                                { this.props.t("forum.AddTopic.form.filestackBtn") }
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
                            className="btn btn-primary new-topic-btn"
                        >
                            { this.props.t("forum.AddTopic.form.submit") }
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default withTranslation("common")(withRouter(AddTopic));