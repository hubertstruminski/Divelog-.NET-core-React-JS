import React from 'react';
import Topic from './Topic';
import ConvertTime from '../../util/ConvertTime';
import { BACKEND_API_URL } from '../../actions/types';

class TopTopics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topEnglishTopics: [],
            topPolishTopics: [],
            topGermanyTopics: [],
            isPolishFive: false,
            isGermanyFive: false,
            isEnglishFive: false,
            isLeft: false
        }
        this.ConvertTime = new ConvertTime();

        this.generateTopPolishTopics = this.generateTopPolishTopics.bind(this);
        this.generateTopGermanyTopics = this.generateTopGermanyTopics.bind(this);
        this.generateTopEnglishTopics = this.generateTopEnglishTopics.bind(this);
    }

    componentDidMount() {
        fetch(`${BACKEND_API_URL}/get/top/topics/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => { return response.json() })
        .then(jsonData => {
            let countTopPolish = 0;
            let countTopGermany = 0;
            let countTopEnglish = 0;
            jsonData.map((topic, index) => {
                if(topic.languageForum === 'polish') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countTopPolish: countTopPolish
                    }
                    this.setState({ topPolishTopics: this.state.topPolishTopics.concat(element) });
                    countTopPolish++
                }

                if(topic.languageForum === 'english') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countTopEnglish: countTopEnglish
                    }
                    this.setState({ topEnglishTopics: this.state.topEnglishTopics.concat(element) });
                    countTopEnglish++
                }

                if(topic.languageForum === 'germany') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countTopGermany: countTopGermany
                    }
                    this.setState({ topGermanyTopics: this.state.topGermanyTopics.concat(element) });
                    countTopGermany++
                }
            });
            this.setState({ isLeft: false }, () => {
                if(this.state.topPolishTopics.length > 4) {
                    this.setState({ isPolishFive: true }, () => {
                        this.props.setTopEnglishFive();
                    });

                }

                if(this.state.topGermanyTopics.length > 4) {
                    this.setState({ isGermanyFive: true }, () => {
                        this.props.setTopGermanyFive();
                    });
                }

                if(this.state.topEnglishTopics.length > 4) {
                    this.setState({ isEnglishFive: true }, () => {
                        this.props.setTopEnglishFive();
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    generateTopPolishTopics() {
        return this.state.topPolishTopics.map((topic, index) => {
            return (
                <Topic 
                    key={index}
                    id={topic.id}
                    owner={topic.owner}
                    title={topic.title}
                    createdAt={topic.createdAt}
                    languageForum={this.props.selectedForum}
                    count={topic.countTopPolish}
                    isLeft={this.state.isLeft}
                />
            );
        });
    }

    generateTopEnglishTopics() {
        return this.state.topEnglishTopics.map((topic, index) => {
            return (
                <Topic 
                    key={index}
                    id={topic.id}
                    owner={topic.owner}
                    title={topic.title}
                    createdAt={topic.createdAt}
                    languageForum={this.props.selectedForum}
                    count={topic.countTopEnglish}
                    isLeft={this.state.isLeft}
                />
            );
        });
    }

    generateTopGermanyTopics() {
        return this.state.topGermanyTopics.map((topic, index) => {
            return (
                <Topic 
                    key={index}
                    id={topic.id}
                    owner={topic.owner}
                    title={topic.title}
                    createdAt={topic.createdAt}
                    languageForum={this.props.selectedForum}
                    count={topic.countTopGermany}
                    isLeft={this.state.isLeft}
                />
            );
        });
    }

    render() {
        let isGermanyFive = this.state.isGermanyFive;
        let isPolishFive = this.state.isPolishFive;
        let isEnglishFive = this.state.isEnglishFive;

        return (
            <div>
                { isPolishFive && this.generateTopPolishTopics()  }
                { isGermanyFive && this.generateTopGermanyTopics() }
                { isEnglishFive && this.generateTopEnglishTopics() }
            </div>
        );
    }
}

export default TopTopics;