import React from 'react';
import '../../css/Home.css';
import divebookLogo from '../../img/divebook.png';
import forumLogo from '../../img/home-forum.png';
import { withTranslation } from 'react-i18next';

class Home extends React.Component {
    render() {
        return (
            <div className="home-container home-container-background">
                <div className="jumbotron jumbotron-fluid home-background shadow-jumbotron">
                    <div className="home-grid">
                        <div className="home-grid-item item1-margin">
                        <h1 className="font-size-jumbotron-1 font-color-jumbotron">
                            {this.props.t("home.built")}
                        </h1>
                        <p className="font-size-jumbotron-2 font-color-jumbotron">
                            {this.props.t("home.step")}
                        </p>
                        </div>
                        <div className="home-grid-item"></div>
                        <div className="home-grid-item">
                            <div className="btn-container">
                            <h1 className="font-size-jumbotron-1 font-color-jumbotron">
                                {this.props.t("home.let")}
                            </h1>
                                <button type="button" className="btn btn-lg btn-fb" style={{color: 'white'}}>
                                    <i className="fab fa-facebook-f pr-1"></i> 
                                    {this.props.t("login.facebook-btn")}
                                </button>
                            </div>
                       </div>
                    </div>
                </div>

                <div className="home-grid-center margin-grid-bottom">
                    <div className="grid-container">
                        <div className="fb-item1">
                            <h1 className="font-size-grid-1 title-grid-padding">
                                {this.props.t("home.fb-title")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("home.fb-paragraph")}
                            </p>
                        </div>
                        <div className="fb-item2"></div>
                    </div>
                </div>
                
                <div className="home-grid-center margin-grid-bottom">
                    <div className="grid-container">
                        <div className="fb-item1">
                            <h1 className="font-size-grid-1 title-grid-padding">
                                {this.props.t("home.logbook")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("home.logbook-paragraph")}
                            </p>
                        </div>
                        <div className="item4">
                            <img src={divebookLogo} alt="divebook" />
                        </div>
                    </div>
                </div>

                <div className="home-grid-center margin-grid-bottom">
                    <div className="grid-container">
                        <div className="fb-item1">
                            <h1 className="font-size-grid-1 title-grid-padding">
                                {this.props.t("home.maps")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("home.maps-paragraph")}
                            </p>
                        </div>
                        <div className="item6"></div>
                    </div>
                </div>

                <div className="home-grid-center margin-grid-bottom">
                    <div className="grid-container">
                        <div className="fb-item1">
                            <h1 className="font-size-grid-1 title-grid-padding">
                                {this.props.t("home.computer")}
                                <br />
                                <span style={{color: 'red', fontSize: '1.3vw', fontWeight: '800'}}>
                                    {this.props.t("home.progress")}
                                </span>
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("home.computer-paragraph")}
                            </p>
                        </div>
                        <div className="item8"></div>
                    </div>
                </div>

                <div className="home-grid-center margin-grid-bottom">
                    <div className="grid-container">
                        <div className="fb-item1">
                            <h1 className="font-size-grid-1 title-grid-padding">
                                {this.props.t("home.forum")}
                            </h1>
                            <p className="fb-pgh">
                                {this.props.t("home.forum-paragraph")}
                            </p>
                        </div>
                        <div className="item10">
                            <img src={forumLogo} alt="Forum" />
                        </div>
                    </div>
                </div>

                <div className="footer footer-shadow">
                    &copy; {this.props.t("home.footer")}
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Home);