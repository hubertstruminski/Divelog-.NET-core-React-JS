import React from 'react';
import '../../../css/twitter-home/TwitterHomeAdd.css';
import * as filestack from 'filestack-js';
import ReactFilestack from 'filestack-react';
import $ from 'jquery';
import swal from 'sweetalert';
import axios from 'axios';
import AuthService from '../../../util/AuthService';
import { BACKEND_API_URL } from '../../../actions/types';

class TwitterHomeAdd extends React.Component {
    constructor() {
        super();

        this.state = {
            files: [],
            failedFiles: [],
            isSuccessUploaded: false,
            isFailedUploaded: false,
            message: '',
            isScriptInjected: false
        }
        this.Auth = new AuthService();

        this.onChange = this.onChange.bind(this);
        this.removeRenderedFile = this.removeRenderedFile.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
        this.filestackCallback = this.filestackCallback.bind(this);
        this.onErrorFilestack = this.onErrorFilestack.bind(this);
        this.onSubmitTweet = this.onSubmitTweet.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value }, () => {
            if(this.state.message.length > 0) {
                $(".add-tweet-button-home-timeline").css({ "background-color": "#00A4EF" });
                $(".add-tweet-button-home-timeline").hover(function() {
                    $(".add-tweet-button-home-timeline").css({ "background-color": "#0094D8" });
                }, function() {
                    $(".add-tweet-button-home-timeline").css({ "background-color": "#00A4EF" });
                });
            } else {
                $(".add-tweet-button-home-timeline").css({ "background-color": "#7FD1F7" });
            }
        });
    }

    removeRenderedFile(handle) {
        this.state.files.map((file, index) => {
            if(file.handle === handle) {
                this.setState({ 
                    files: this.state.files.filter((item, i) => i !== index) 
                }, () => {
                    this.renderFiles(this.state.isSuccessUploaded);
                });
            }
        });
    }

    renderFiles(isSuccessUploaded) {
        if(isSuccessUploaded) {
            $("tweet-add-uploaded-files").html("");
            return this.state.files.map((file, index) => {
                return (
                    <React.Fragment>
                        <img
                            key={index}
                            className="tweet-add-rendered-file-image"
                            src={file.url}
                            alt={file.name}
                        />
                        <br />
                        <button className="upload-file-delete" onClick={() => this.removeRenderedFile(file.handle)}>Delete - {file.name}</button>
                    </React.Fragment>
                );
            });
        }
        return null;
    }

    showWarningBeforeInjectingScript(isScriptInjected) {
        if(isScriptInjected) {
            return (
                <div className="alert alert-danger">
                    You can not use script tags.
                </div>
            );
        }
    }

    renderFailedFiles(isFailedUploaded) {
        if(isFailedUploaded) {
            return this.state.failedFiles.map((file, index) => {
                return (
                    <div>
                        {file.name}
                        <br />
                    </div>

                );
            });
        }
    }

    filestackCallback(response) {
        response.filesUploaded.map((fileUploaded, index) => {
            const element = {
                objectId: fileUploaded.uploadId,
                url: fileUploaded.url,
                size: fileUploaded.size,
                name: fileUploaded.originalFile.name,
                type: fileUploaded.originalFile.type,
                handle: fileUploaded.handle
            };
            this.setState({
                files: this.state.files.concat(element),
                isSuccessUploaded: true
            });
        });

        response.filesFailed.map((fileFailed, index) => {
            this.setState({ 
                failedFiles: this.state.failedFiles.concat(fileFailed),
                isFailedUploaded: true
            });
        });
    }

    onErrorFilestack() {
        swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
    }

    onPick() {
        const client = filestack.init("Abn3RoxlVQeWNtMpk2Gflz");
        client.picker({}).open();
    }

    onSubmitTweet(e) {
        e.preventDefault();

        if(!this.state.message.includes("<script>") && !this.state.message.includes("</script>")) {
            const tweet = {
                message: this.state.message,
                files: this.state.files
            }
            let jwtToken = this.Auth.getRightSocialToken();

            axios({
                url: `${BACKEND_API_URL}/twitter/create/tweet`,
                method: 'POST',
                data: JSON.stringify(tweet),
                headers: {
                    'Authorization': `${jwtToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.status !== 200) {
                    swal(this.props.t("error-500.title"), this.props.t("error-500.message"), "error");
                    e.preventDefault();
                } else {
                    this.props.addNewTweet(response.data);
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            e.preventDefault();
            this.setState({ isScriptInjected: true })
        }
    }

    render() {
        let isFailedUploaded = this.state.isFailedUploaded;
        return (
            <div className="add-tweet-container">
                <div className="avatar-tweet-textarea-container">
                    <div className="tweet-add-avatar-container">
                        <img 
                            src={this.props.pictureUrl} 
                            alt="Avatar" 
                            className="tweet-add-avatar"
                        />
                    </div>
                    <div className="tweet-add-textarea-container">
                        <textarea
                            name="message"
                            placeholder="What's happening?"
                            value={this.state.message}
                            onChange={this.onChange}
                        >  
                        </textarea>
                        
                    
                    </div>
                </div>
                <div className="tweet-add-uploaded-files">
                    { this.renderFiles(this.state.isSuccessUploaded) }
                    {
                        isFailedUploaded &&
                        <div className="alert alert-danger">
                            Failed upload files:
                            <br />
                            { this.renderFailedFiles(this.state.isFailedUploaded) }
                        </div>
                    }
                    { this.showWarningBeforeInjectingScript(this.state.isScriptInjected) }
                </div>
                <div className="add-tweet-buttons">
                    <ReactFilestack
                        apikey="Abn3RoxlVQeWNtMpk2Gflz"
                        actionOptions={{
                            maxSize: 5 * 1024 * 1024,
                            maxFiles: 4,
                            accept: ["image/png", "image/jpg"]
                        }}
                        customRender={({ onPick }) => (
                            <i 
                                className="far fa-images" 
                                style={{ color: '#00A4EF', fontSize: "1.5vw", width: "15%", marginTop: "3%"}}
                                onClick={onPick}
                            ></i>
                        )}
                        onSuccess={this.filestackCallback}
                        onError={this.onErrorFilestack}
                    />
                    <button 
                        className="add-tweet-button-home-timeline"
                        onClick={this.onSubmitTweet}
                    >
                        Tweet
                    </button>
                </div>
            </div>
        );
    }
}

export default TwitterHomeAdd;