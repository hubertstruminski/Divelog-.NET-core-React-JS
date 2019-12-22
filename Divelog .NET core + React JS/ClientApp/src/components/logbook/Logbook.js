import React from 'react';
import '../../css/Logbook.css';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import DeleteTableButton from './DeleteTableButton';
import UpdateLogbookButton from './UpdateLogbookButton';
import PDFTableButton from './PDFTableButton';
import ConvertTime from '../../util/ConvertTime';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class Logbook extends React.Component {
    constructor() {
        super();
        
        this.state = {
            isEmptyLogbook: true,
            deletedLogbookId: 0
        }
        this.Auth = new AuthService();
        this.logbooks = [];
        this.bodyTableRef = React.createRef();
        
        this.showTableRows = this.showTableRows.bind(this);
        this.setDeletedLogbookId = this.setDeletedLogbookId.bind(this);
        this.fetchLogbooks = this.fetchLogbooks.bind(this);

        this.ConvertTime = new ConvertTime();
    }

    componentDidMount() {
        let jwtToken = this.Auth.getRightSocialToken();

        fetch(`${BACKEND_API_URL}/get/logbook/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(jsonData => {
            jsonData.map((jsonElement, index) => {
                let time = this.ConvertTime.convertTime(jsonElement.entryTime, jsonElement.exitTime, false);

                const element = {
                    id: jsonElement.id,
                    partnerName: jsonElement.partnerName,
                    partnerSurname: jsonElement.partnerSurname,
                    entryTime: time[0],
                    exitTime: time[1],
                    marker: jsonElement.marker.name,
                    averageDepth: jsonElement.averageDepth,
                    maxDepth: jsonElement.maxDepth,
                    airTemperature: jsonElement.airTemperature,
                    waterTemperature: jsonElement.waterTemperature,
                    divingType: jsonElement.divingType
                }
                this.logbooks.push(element);
            });
            if(this.logbooks.length === 0) {
                this.setState({ isEmptyLogbook: true });
            } else {
                if(this.state.isEmptyLogbook === true) {
                    this.setState({ isEmptyLogbook: false });
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    fetchLogbooks() {
        let jwtToken = this.Auth.getRightSocialToken(); 

        fetch(`${BACKEND_API_URL}/get/logbook/${jwtToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(jsonData => {
            this.logbooks = [];
            jsonData.map((jsonElement, index) => {
                let time = this.ConvertTime.convertTime(jsonElement.entryTime, jsonElement.exitTime, false);

                const element = {
                    id: jsonElement.id,
                    partnerName: jsonElement.partnerName,
                    partnerSurname: jsonElement.partnerSurname,
                    entryTime: time[0],
                    exitTime: time[1],
                    marker: jsonElement.marker.name,
                    averageDepth: jsonElement.averageDepth,
                    maxDepth: jsonElement.maxDepth,
                    airTemperature: jsonElement.airTemperature,
                    waterTemperature: jsonElement.waterTemperature,
                    divingType: jsonElement.divingType
                }
                this.logbooks.push(element);
            });
            if(this.logbooks.length === 0) {
                this.setState({ isEmptyLogbook: true });
            } else {
                if(this.state.isEmptyLogbook === true) {
                    this.setState({ isEmptyLogbook: false });
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    showTableRows() {
        let rowNumber = 0;
        return this.logbooks.map((logbook, index) => {
            return (
                <tr key={index}>
                    <th scope="row">{++rowNumber}</th>
                    <td>{logbook.partnerName}</td>
                    <td>{logbook.partnerSurname}</td>
                    <td>{logbook.entryTime}</td>
                    <td>{logbook.exitTime}</td>
                    <td>{logbook.marker}</td>
                    <td>{logbook.averageDepth}m</td>
                    <td>{logbook.maxDepth}m</td>
                    <td>{logbook.airTemperature}<sup>o</sup>C</td>
                    <td>{logbook.waterTemperature}<sup>o</sup>C</td>
                    <td>{logbook.divingType}</td>
                    <td>
                        <PDFTableButton id={logbook.id} />
                    </td>
                    <td>
                        <UpdateLogbookButton id={logbook.id} />
                    </td>
                    <td>
                        <DeleteTableButton 
                            id={logbook.id} 
                            setIsDeletedRow={this.setIsDeletedRow}
                            setDeletedLogbookId={this.setDeletedLogbookId}
                            fetchLogbooks={this.fetchLogbooks}
                        />
                    </td>
                </tr>
            );
        });
    }

    showTable() {
        return (
            <div className="table-center table-margin">
                <div className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col">#</th>
                                <td>
                                    {this.props.t("logbook.table.partnerName")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.partnerSurname")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.entryTime")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.exitTime")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.location")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.avgDepth")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.maxDepth")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.airTemperature")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.waterTemperature")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.divingType")}
                                </td>
                                <td>PDF</td>
                                <td>
                                    {this.props.t("logbook.table.UPDATE")}
                                </td>
                                <td>
                                    {this.props.t("logbook.table.DELETE")}
                                </td>
                            </tr>
                        </thead>
                        <tbody ref={this.bodyTableRef}>
                            { this.showTableRows() }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    setDeletedLogbookId(value) {
        this.setState({ deletedLogbookId: value }, () => {
            let id = this.state.deletedLogbookId;
            let index = 0;
            this.logbooks.map((logbook, index) => {
                if(logbook.id === id) {
                    this.logbooks.splice(index, 1);
                    this.forceUpdate();
                }
                index++;
            });
        });
    }

    render() {
        let isEmptyLogbook = this.state.isEmptyLogbook;

        return (
            <div className="logbook-container">
                <Link 
                    to="/add/dive"
                >
                    <div className="btn btn-primary btn-padding">
                        {this.props.t("logbook.addButton")}
                    </div>
                </Link>
                { !isEmptyLogbook && this.showTable() } 
                <NoLogbookData isEmptyLogbook={this.state.isEmptyLogbook} />
            </div>
        );
    }
}

function NoLogbookData(props) {
    if(props.isEmptyLogbook) {
        return (
            <div className="alert alert-danger alert-margin">
                No data in your logbook.
            </div>
        );
    }
    return null;
}

export default withTranslation("common")(withRouter(Logbook));