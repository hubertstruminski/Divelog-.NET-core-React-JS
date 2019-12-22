import React from 'react';
import '../../css/Header.css';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import logo from '../../img/eDivelog.png';

class HeaderOut extends React.Component {
    render() {
        const  { i18n } = this.props;

        return (
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link to="/home" className="navbar-brand">
                        <span className="logoSize">
                            Divelog
                        </span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item mt-2">
                                <i
                                    onClick={() => i18n.changeLanguage("en")} 
                                    className="gb uk flag nav-link"
                                />
                            </li>
                            <li className="nav-item mt-2">
                                <i 
                                    onClick={() => i18n.changeLanguage("de")} 
                                    className="de flag nav-link"
                                />
                            </li>
                            <li className="nav-item mt-2">
                                <i 
                                    onClick={() => i18n.changeLanguage("pl")} 
                                    className="pl flag nav-link" 
                                />
                            </li>
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">
                                    {this.props.t("header.home")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/guide" className="nav-link">
                                    {this.props.t("header.guide")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    {this.props.t("header.aboutMe")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/donate" className="nav-link">
                                    {this.props.t("header.donate")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">
                                    {this.props.t("header.contact")}
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav my-lg justify-content-end">
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    {this.props.t("header.login")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

export default withTranslation('common')(HeaderOut);