import React from 'react';
import '../../css/AboutMe.css';
import me from '../../img/me.png';
import { withTranslation } from 'react-i18next';

class AboutMe extends React.Component {
    render() {
        return (
            <div className="about-container">
                <div className="about-jumbotron about-jumbotron-shadow">
                    <div className="about-jumbotron-text">
                        <p>
                            {this.props.t("aboutMe.jumbotron")}
                        </p>
                    </div>
                </div>

                <div className="card-center card-margin-bottom">
                    <div className="card card-size card-shadow">
                        <div className="grid-about-container">
                            <div className="grid-about-item">
                                <img src={me} alt="Hubert Strumiński" className="about-photo"/>
                            </div>
                            <div className="grid-about-item-2">
                                <div className="about-item2">
                                    Hubert Strumiński
                                </div>
                                <div className="about-txt-1">
                                    <p>
                                        {this.props.t("aboutMe.text")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="thanks-txt-2">
                            <p>
                                {this.props.t("aboutMe.end-text")}
                            </p>
                            <div className="about-greetings-txt-3">
                                <p>
                                    {this.props.t("aboutMe.thanks")}
                                </p>
                                <p className="signature-me">Hubert Strumiński</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(AboutMe);