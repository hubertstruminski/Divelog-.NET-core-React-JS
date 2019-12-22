import React from 'react';
import '../../css/TopicWithPosts.css';
import ConvertTime from '../../util/ConvertTime';
import AddPosts from '../forum/AddPosts';
import ReactPlayer from 'react-player';
import Post from './Post';
import Pagination from 'react-js-pagination';
import UpdateTopicButton from './UpdateTopicButton';
import AuthService from '../../util/AuthService';
import { BACKEND_API_URL } from '../../actions/types';

class TopicWithPosts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mainPost: {},
            isRetrieved: false,
            posts: [],
            isOwner: false,
            email: '',
            isUpdatingPost: false,
            activePage: 1,
            itemPerPage: 10,
            wasUpdatedPost: false
        }
        this.Auth = new AuthService();
        this.files = []
        this.ConvertTime = new ConvertTime();

        this.addImages = this.addImages.bind(this);
        this.addVideos = this.addVideos.bind(this);
        this.addPosts = this.addPosts.bind(this);
        this.fetchTopicAndPosts = this.fetchTopicAndPosts.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.setDeletedFileForPost = this.setDeletedFileForPost.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;

        fetch(`${BACKEND_API_URL}/get/topic/posts/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(jsonData => {
            this.files = [];

            jsonData.files.map((file, index) => {
                const element = {
                    id: file.id,
                    objectId: file.objectId,
                    url: file.url,
                    size: file.size,
                    name: file.name,
                    type: file.type
                }
                this.files.push(element);
            });

            jsonData.posts.map((post, index) => {
                let files = [];
                post.files.map((file, index) => {
                    const element = {
                        id: file.id,
                        objectId: file.objectId,
                        url: file.url,
                        size: file.size,
                        name: file.name,
                        type: file.type
                    }
                    files.push(element);
                });

                let updatedAt = '';

                if(post.updatedAt !== null) {
                    this.setState({ wasUpdatedPost: true });
                    updatedAt = this.ConvertTime.convertTime(post.updatedAt, null, false);
                }

                const element = {
                    id: post.id,
                    message: post.message,
                    createdAt: this.ConvertTime.convertTime(post.createdAt, null, false),
                    updatedAt: updatedAt,
                    files: files,
                    user: post.user
                }
                this.setState({ posts: this.state.posts.concat(element) });
            });

            const element = {
                title: jsonData.title,
                message: jsonData.message,
                createdAt: this.ConvertTime.convertTime(jsonData.createdAt, null, false)[0],
                owner: jsonData.user.name,
                pictureUrl: jsonData.user.pictureUrl,
                files: this.files
            }
            this.setState({ 
                mainPost: element, 
                isRetrieved: true
            }, () => {
                let jwtToken = this.Auth.getRightSocialToken();

                fetch(`/getuserdata/${jwtToken}`, {
                    method: 'GET',
                    headers: {
                    'content-type': 'application/json'
                    }
                })
                .then(response => { return response.json() })
                .then(jsonData => {
                    this.setState({ email: jsonData.email }, () => {
                        this.state.posts.map((post, index) => {
                            if(post.user.email === this.state.email) {
                                this.setState({ isOwner: true });
                            }
                        });     
                    });
                }); 
            });
        }).catch(err => {
            console.log(err);
        });
    }

    fetchTopicAndPosts() {
        let id = this.props.match.params.id;

        this.setState({
            mainPost: {},
            posts: [],
            isRetrieved: false,
            isOwner: false,
            email: ''
        }, () => {
            fetch(`/get/topic/posts/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(jsonData => {
                this.files = [];
    
                jsonData.files.map((file, index) => {
                    const element = {
                        id: file.id,
                        objectId: file.objectId,
                        url: file.url,
                        size: file.size,
                        name: file.name,
                        type: file.type
                    }
                    this.files.push(element);
                });
    
                jsonData.posts.map((post, index) => {
                    let files = [];
                    post.files.map((file, index) => {
                        const element = {
                            id: file.id,
                            objectId: file.objectId,
                            url: file.url,
                            size: file.size,
                            name: file.name,
                            type: file.type
                        }
                        files.push(element);
                    });

                    let updatedAt = '';

                    if(post.updatedAt !== null) {
                        this.setState({ wasUpdatedPost: true });
                        updatedAt = this.ConvertTime.convertTime(post.updatedAt, null, false);
                    }
    
                    const element = {
                        id: post.id,
                        message: post.message,
                        createdAt: this.ConvertTime.convertTime(post.createdAt, null, false),
                        updatedAt: updatedAt,
                        files: files,
                        user: post.user
                    }
                    this.setState({ posts: this.state.posts.concat(element) });
                });
    
                const element = {
                    title: jsonData.title,
                    message: jsonData.message,
                    createdAt: this.ConvertTime.convertTime(jsonData.createdAt, null, false)[0],
                    owner: jsonData.user.name,
                    pictureUrl: jsonData.user.pictureUrl,
                    files: this.files
                }
                this.setState({ 
                    mainPost: element, 
                    isRetrieved: true
                }, () => {
                    let jwtToken = this.Auth.getRightSocialToken();
    
                    fetch(`${BACKEND_API_URL}/getuserdata/${jwtToken}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => { return response.json() })
                    .then(jsonData => {
                        this.setState({ email: jsonData.email }, () => {
                            this.state.posts.map((post, index) => {
                                if(post.user.email === this.state.email) {
                                    this.setState({ isOwner: true });
                                }
                            });      
                        });
                    }); 
                });
            }).catch(err => {
                console.log(err);
            });
        });
    }

    addImages() {
        return this.state.mainPost.files.map((file, index) => {
            if(file.type.includes('image')) {
                return (
                    <div>
                        <br />
                        <img 
                            src={file.url} 
                            alt={file.name} 
                            className="attachment-images"
                        />
                        <br />
                        { file.name }
                        <br />
                    </div>
                );
            }
        });
    }

    addVideos() {
        return this.state.mainPost.files.map((file, index) => {
            if(file.type.includes('video')) {
                return (
                    <div>
                        <br />
                        <ReactPlayer 
                            url={file.url} 
                            playing
                            controls="true"
                        />
                        <br />
                        { file.name }
                        <br />
                    </div>
                );
            }
        })
    }

    addPosts() {
        var lastIndex = this.state.activePage * this.state.itemPerPage;
        var firstIndex = lastIndex - this.state.itemPerPage;

        let count = 0;
        return this.state.posts.slice(firstIndex, lastIndex).map((post, index) => {
            return (
                <Post 
                    key={index}
                    id={post.id}
                    counter={count++}
                    message={post.message}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    files={post.files}
                    user={post.user}
                    fetchTopicAndPosts={this.fetchTopicAndPosts}
                    setDeletedFileForPost={this.setDeletedFileForPost}
                    wasUpdatedPost={this.state.wasUpdatedPost}
                />
            );
        });
    }

    setDeletedFileForPost(postId, fileId) {
        this.state.posts.map((post, index) => {
            if(post.id === postId) {
                post.files.map((file, index) => {
                    if(file.id === fileId) {
                        this.setState({ files: this.state.posts.files.splice(index, 1) });
                    }
                });
            }
        });
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
    }

    render() {
        let isRetrieved = this.state.isRetrieved;
        let isOwner = this.state.isOwner;

        return (
            <div className="topic-posts-container">
                <div className="main-post-center">
                    <div className="main-post-container">
                        <div className="main-post-grid-one">
                            <div className="main-post-header">
                                { this.state.mainPost.createdAt }
                            </div>
                            <div className="main-post-avatar">
                                <img src={this.state.mainPost.pictureUrl} alt="Avatar" />
                            </div>
                            <div className="main-post-footer">
                                { this.state.mainPost.owner }
                            </div>
                        </div>
                        <div className="main-post-grid-two">
                            <div className="main-post-title">
                                { this.state.mainPost.title }
                            </div>
                            <div className="main-post-message">
                                { this.state.mainPost.message }
                            </div>
                            <div className="main-post-attachments">
                                { isRetrieved && this.addImages() }
                                { isRetrieved && this.addVideos() }
                            </div>

                            <div>
                                { isOwner &&
                                    <>
                                        <hr />
                                        <UpdateTopicButton 
                                            topicId={this.props.match.params.id}
                                        />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="line-break-posts"></div>

                <div>
                    { isRetrieved && this.addPosts() }
                    <div className="pagination-center">
                        <Pagination
                            hideNavigation
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemPerPage}
                            totalItemsCount={this.state.posts.length}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="page-active"
                        />
                    </div>
                </div>

                <div className="">
                    <AddPosts 
                        topicId={this.props.match.params.id}
                        fetchTopicAndPosts={this.fetchTopicAndPosts}
                    />
                </div>
            </div>
        );
    }
}

export default TopicWithPosts;