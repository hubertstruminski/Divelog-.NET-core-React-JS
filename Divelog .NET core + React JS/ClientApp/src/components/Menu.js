import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

class Menu extends React.Component {
    render() {
        return (
            <div>
                <ul className="list-group">
                    <Link 
                        to="/dashboard" 
                        className="list-group-item item-menu a-link-menu"
                    >
                        {this.props.t("menu.socialMedia")}
                    </Link>
                    <Link 
                        to="/logbook" 
                        className="list-group-item item-menu a-link-menu"
                    >
                        {this.props.t("menu.logbook")}
                    </Link>
                    <Link 
                        to="/map" 
                        className="list-group-item item-menu a-link-menu"
                    >
                        {this.props.t("menu.map")}
                    </Link>
                    <Link 
                        to="/forum" 
                        className="list-group-item item-menu a-link-menu"
                    >
                        {this.props.t("menu.forum")}
                    </Link>
                    <Link 
                        to="/settings" 
                        className="list-group-item item-menu a-link-menu"
                    >
                        {this.props.t("menu.settings")}
                    </Link>
                </ul>
            </div>
        );
    }
}

export default withTranslation('common')(Menu);