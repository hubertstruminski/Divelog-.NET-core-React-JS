import React from 'react';
import '../../css/Forum.css';
import poland from '../../img/flags/poland.jpg';
import germany from '../../img/flags/germany.png';
import england from '../../img/flags/england.jpg';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Topic from './Topic';
import ConvertTime from '../../util/ConvertTime';
import TopTopics from './TopTopics';
import logo from '../../img/eDivelog.png';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { BACKEND_API_URL } from '../../actions/types';

class Forum extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedForum: '',
            isEnglishForum: false,
            isPolishForum: false,
            isGermanyForum: false,
            englishTopics: [],
            polishTopics: [],
            germanyTopics: [],
            isTopEnglishForum: false,
            isTopPolishForum: false,
            isTopGermanyForum: false,
            topEnglishTopics: [],
            topPolishTopics: [],
            topGermanyTopics: [],
            isGermanyFive: false,
            isPolishFive: false,
            isEnglishFive: false,
            isLeft: false
        }
        this.ConvertTime = new ConvertTime();

        this.onFlagClick = this.onFlagClick.bind(this);
        this.onCreateTopicClick = this.onCreateTopicClick.bind(this);
        this.generatePolishTopics = this.generatePolishTopics.bind(this);

        this.setTopEnglishFive = this.setTopEnglishFive.bind(this);
        this.setTopGermanyFive = this.setTopGermanyFive.bind(this);
        this.setTopPolishFive = this.setTopPolishFive.bind(this);
    }

    componentDidMount() {
        fetch(`${BACKEND_API_URL}/get/topics/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {return response.json()})
        .then(jsonData => {
            let countPolish = 0;
            let countGermany = 0;
            let countEnglish = 0;
            jsonData.map((topic, index) => {
                if(topic.languageForum === 'polish') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countPolish: countPolish
                    }
                    this.setState({ polishTopics: this.state.polishTopics.concat(element) });
                    countPolish++
                }

                if(topic.languageForum === 'english') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countEnglish: countEnglish
                    }
                    this.setState({ englishTopics: this.state.englishTopics.concat(element) });
                    countEnglish++
                }

                if(topic.languageForum === 'germany') {
                    let time = this.ConvertTime.convertTime(topic.createdAt, null, false);

                    const element = {
                        id: topic.id,
                        title: topic.title,
                        createdAt: time[0],
                        owner: topic.user.name,
                        countGermany: countGermany
                    }
                    this.setState({ germanyTopics: this.state.germanyTopics.concat(element) });
                    countGermany++
                }
            });
            this.setState({ isLeft: true });
        }).catch(err => {
            console.log(err);
        });
    }

    onFlagClick(e) {
        e.preventDefault();

        $("#polandFlag").click(() => {
            this.setState({ 
                selectedForum: 'polish',
                isPolishForum: true,
                isEnglishForum: false,
                isGermanyForum: false,
                isTopPolishForum: true,
                isTopEnglishForum: false,
                isTopGermanyForum: false
            }, () => {
                $("#polandFlag").addClass("isActiveFlag");
                $("#germanyFlag").removeClass("isActiveFlag");
                $("#englandFlag").removeClass("isActiveFlag");
            });
        });

        $("#germanyFlag").click(() => {
            this.setState({ 
                selectedForum: 'germany',
                isGermanyForum: true,
                isPolishForum: false,
                isEnglishForum: false,
                isTopGermanyForum: true,
                isTopPolishForum: false,
                isTopEnglishForum: false
            }, () => {
                $("#germanyFlag").addClass("isActiveFlag");
                $("#polandFlag").removeClass("isActiveFlag");
                $("#englandFlag").removeClass("isActiveFlag");
            });
        });

        $("#englandFlag").click(() => {
            this.setState({ 
                selectedForum: 'english',
                isEnglishForum: true,
                isPolishForum: false,
                isGermanyForum: false,
                isTopEnglishForum: true,
                isTopPolishForum: false,
                isTopGermanyForum: false
            }, () => {
                $("#englandFlag").addClass("isActiveFlag");
                $("#germanyFlag").removeClass("isActiveFlag");
                $("#polandFlag").removeClass("isActiveFlag");
            });
        });
    }

    onCreateTopicClick(e) {
        if(this.state.selectedForum === '') {
            e.preventDefault();
            swal(this.props.t("forum.forum.news.title"), this.props.t("forum.forum.news.message"), "warning");
        }
    }

    generatePolishTopics() {
        return this.state.polishTopics.map((topic, index) => {
             return (
                <Topic 
                    id={topic.id}
                    owner={topic.owner}
                    title={topic.title}
                    createdAt={topic.createdAt}
                    languageForum={this.state.selectedForum}
                    count={topic.countPolish}
                    isLeft={this.state.isLeft}
                />
            );
        });
    }

    generateGermanyTopics() {
        return this.state.germanyTopics.map((topic, index) => {
            return (
               <Topic 
                   id={topic.id}
                   owner={topic.owner}
                   title={topic.title}
                   createdAt={topic.createdAt}
                   languageForum={this.state.selectedForum}
                   count={topic.countGermany}
                   isLeft={this.state.isLeft}
               />
           );
       });
    }

    generateEnglishTopics() {
        return this.state.englishTopics.map((topic, index) => {
            return (
               <Topic 
                   id={topic.id}
                   owner={topic.owner}
                   title={topic.title}
                   createdAt={topic.createdAt}
                   languageForum={this.state.selectedForum}
                   count={topic.countEnglish}
                   isLeft={this.state.isLeft}
               />
           );
       });
    }

    setTopEnglishFive() {
        this.setState({ isEnglishFive: true });
    }

    setTopGermanyFive() {
        this.setState({ isGermanyFive: true });
    }

    setTopPolishFive() {
        this.setState({ isPolishFive: true });
    }

    render() {
        let isPolishForum = this.state.isPolishForum;
        let isGermanyForum = this.state.isGermanyForum;
        let isEnglishForum = this.state.isEnglishForum;

        let isTopPolishForum = this.state.isTopPolishForum;
        let isTopGermanyForum = this.state.isTopGermanyForum;
        let isTopEnglishForum = this.state.isTopEnglishForum;

        let isEnglishFive = this.state.isEnglishFive;
        let isPolishFive = this.state.isPolishFive;
        let isGermanyFive = this.state.isGermanyFive;

        return (
            <div className="forum-container">
                <div className="forum-title">
                    { this.props.t("forum.forum.title") }
                </div>
                <div className="language-forum-box language-forum-box-center language-shadow">
                    <div className="flag-item">
                        <img 
                            id="polandFlag"
                            src={poland} 
                            alt="Polish flag"
                            onClick={this.onFlagClick}
                        />
                    </div>
                    <div className="flag-item">
                        <img 
                            id="germanyFlag"
                            src={germany} 
                            alt="Germany flag" 
                            onClick={this.onFlagClick}
                        />
                    </div>
                    <div className="flag-item">
                        <img 
                            id="englandFlag"
                            src={england} 
                            alt="English flag"
                            onClick={this.onFlagClick} 
                        />
                    </div>
                </div>
                <Link to={`/create/topic/${this.state.selectedForum}`}>
                    <button 
                        className="btn btn-primary btn-padding"
                        onClick={this.onCreateTopicClick}
                    >
                        { this.props.t("forum.forum.createBtn") }
                    </button>
                </Link>
                { ( isPolishForum || isGermanyForum || isEnglishForum ) ?
                    (
                        <div className="wrapper-forum-box">
                            <div className="forum-topics-box">
                                { (isPolishForum || isGermanyForum || isEnglishForum) && <div className="topics-box-title">All topics</div> }
                                
                                { isPolishForum && this.generatePolishTopics() }
                                { isGermanyForum && this.generateGermanyTopics() }
                                { isEnglishForum && this.generateEnglishTopics() }
                            </div>
                            <div className="forum-top-topics">
                                { ( isEnglishFive || isGermanyFive || isPolishFive ) && <div className="top-topics-title">The most popular topics</div> }
                                { (isTopPolishForum || isTopGermanyForum || isTopEnglishForum) && 
                                    <TopTopics 
                                        selectedForum={this.state.selectedForum}
                                        setTopFiveIsTrue={this.setTopFiveIsTrue}
                                        setTopEnglishFive={this.setTopEnglishFive}
                                        setTopGermanyFive={this.setTopGermanyFive}
                                        setTopPolishFive={this.setTopPolishFive}
                                    />
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="forum-diver">
                            <img src={logo} alt="Forum diver" />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default withTranslation("common")(withRouter(Forum));