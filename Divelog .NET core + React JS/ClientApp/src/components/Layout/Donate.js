import React from 'react';
import '../../css/Donate.css';
import '../../css/Home.css';
import { withTranslation } from 'react-i18next';

class Donate extends React.Component {
    render() {
        return (
            <div className="donate-container">
                <div className="donate-jumbotron donate-jumbotron-shadow">
                    <div className="donate-jumbotron-text">
                        <p>
                            {this.props.t("donate.jumbotron")}
                        </p>
                    </div>
                </div>

                <div className="donate-center">
                    <div className="grid-container bottom-margin">
                        <div className="donate-text">
                            <h1 className="donate-font-size-title-1">
                                {this.props.t("donate.title-1")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("donate.paragraph-1")}
                            </p>
                        </div>
                        <div className="donate-background"></div>
                    </div>
                </div>

                <div className="donate-center">
                    <div className="donate-button-container bottom-margin">
                        <div className="donate-button-title">
                            <p>
                                {this.props.t("donate.button-title")}
                            </p>
                        </div>
                        <div className="">
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="hosted_button_id" value="9GCZ2FFYL45UG" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                            
                            <img alt="" border="0" src="https://www.paypal.com/en_PL/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Donate);