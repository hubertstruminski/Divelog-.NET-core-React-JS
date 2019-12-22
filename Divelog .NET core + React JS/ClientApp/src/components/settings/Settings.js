import React from 'react';
import '../../css/Settings.css';
import { BACKEND_API_URL } from '../../actions/types';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        fetch(`${BACKEND_API_URL}/generate/pdf`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'content-type': 'application/json'
            },
            responseType: 'blob'
        // }).then(response => {
        //     console.log(response.text());
        //     const file = new Blob([response.data], { type: 'application/pdf' });
        //     const fileURL = URL.createObjectURL(file);
        //     window.open(fileURL);
        // });
        }).then(response => response.blob()).then(this.showFile)
    }

    showFile(blob){
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        var newBlob = new Blob([blob], {type: "application/pdf"})

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        } 

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download="file.pdf";
        link.click();
        setTimeout(function(){
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    render() {
        return (
            <div className="settings-container">
                <button className="btn btn-primary" onClick={this.onClick}>PDF</button>
            </div>
        );
    }
}

export default Settings;