import React from 'react';

class LeftCard extends React.Component {
    render() {
        return (
            <div>
                <ul className="list-group">
                    <li className="list-group-item active">
                        Aktualności
                    </li>
                    <li className="list-group-item">
                        Grupy
                    </li>
                    <li className="list-group-item"></li>
                    <li className="list-group-item"></li>
                    <li className="list-group-item"></li>
                </ul>
            </div>
        );
    }
}

export default LeftCard;