import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom"; //BrowserRouter uses the history api ,no hashes. Link elements for all of our links to routes.

// import Logo from './logo';
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      uploaderIsVisible: false
    };
    this.showUploader = this.showUploader.bind(this);
    this.hideUploader = this.hideUploader.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.setBio = this.setBio.bind(this);
  }

  showUploader() {
    this.setState({
      uploaderIsVisible: true
    });
  }
  hideUploader() {
    this.setState({
      uploaderIsVisible: false
    });
  }
  updateImage(url) {
    this.setState({
      imgUrl: url,
      uploaderIsVisible: false
    });
  }
  setBio(newBio) {
    this.setState({
      bio: newBio
    });
  }
  // #2 then componentDidMount runs
  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      this.setState(data);
    });
  }

  // #1 first it renders
  render() {
    return (
      <div className="app-container">
        <ProfilePic
          size="small"
          imgUrl={this.state.imgUrl}
          first={this.state.first}
          last={this.state.last}
          showUploader={() => this.showUploader()}
        />
        <BrowserRouter>
          <div className="profile-container">
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <Profile
                    id={this.state.id}
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                    bio={this.state.bio}
                    setBio={this.setBio}
                    showUploader={this.showUploader}
                  />
                );
              }}
            />
          </div>
        </BrowserRouter>

        {this.state.uploaderIsVisible && (
          <Uploader updateImage={this.updateImage} />
        )}
      </div>
    );
  }
}

// <div>
//        <header>
//            <Logo />
//            <ProfilePic
//                first={this.state.first}
//                last={this.state.last}
//                profilePicUrl={this.state.image ? this.state.image : "/default.jpg"}
//                showUploader={this.showUploader}
//            />
//        </header>
