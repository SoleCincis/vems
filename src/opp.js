import React from "react";
import axios from "./axios";
export default class OtherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    axios
      .get(`/user/${this.props.match.params.id}/profile`)
      .then(({ data }) => {
        this.setState(data);
      });
  }
  render() {
    if (!this.state.userId) {
      return null;
    }

    return (
      <div className="profile-container">
        <img className="profilePic" src={this.state.imgUrl} />
        <div>
          <h1>
            this is the profile of {this.state.first} {this.state.last}
          </h1>
          {this.state.bio}
        </div>
      </div>
    );
  }
}
