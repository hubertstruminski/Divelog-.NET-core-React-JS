import React from 'react';
import '../../css/Contact.css';
import '../../css/Home.css';
import { withTranslation } from 'react-i18next';

class Contact extends React.Component {
    render() {
        return (
            <div className="contact-container">
                <div className="contact-jumbotron contact-jumbotron-shadow">
                    <div className="contact-jumbotron-text">
                        <p>
                            {this.props.t("contact.jumbotron")}
                        </p>
                    </div>
                </div>

                <div className="contact-center">
                    <div className="grid-container bottom-margin">
                        <div className="donate-text">
                            <h1 className="donate-font-size-title-1">
                                {this.props.t("contact.contact-title")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("contact.contact-paragraph")}
                            </p>
                        </div>
                        <div className="contact-background">

                        </div>
                    </div>
                </div>

                <div className="contact-center">
                    <div className="mail-container bottom-margin mail-background">
                        <div className="mail-title">
                            <p>
                                {this.props.t("contact.form-title")}
                            </p>
                        </div>
                        <div className="form-container-contact">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="inputEmail">
                                        {this.props.t("contact.form.email")}
                                    </label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg" 
                                        id="inputEmail"
                                        placeholder="Enter email" 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="textArea">
                                        {this.props.t("contact.form.message")}
                                    </label>
                                    <textarea 
                                        className="form-control form-control-lg" 
                                        id="textArea" 
                                        rows="10"
                                    >
                                    </textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg">
                                    {this.props.t("contact.form.button")}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Contact);