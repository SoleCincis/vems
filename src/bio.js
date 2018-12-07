import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
export default class Bio extends React.Component {
  constructor() {
    super();
    this.state = {
      showEditor: false
    };
    this.showEditor = this.showEditor.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  showEditor(e) {
    e.preventDefault();
    this.setState({
      bio: this.props.bio,
      showEditor: true
    });
  }

  hideEditor() {
    this.setState({
      showEditor: false
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  // talks with index.js
  handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/history/bio", this.state)
      .then(resp => {
        this.props.setBio(this.state.bio);
        this.setState({
          showEditor: false
        });
      })
      .catch(err => console.log("error in bio: ", err));
  }
  render() {
    if (this.state.showEditor) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <textarea
              defaultValue={this.props.bio}
              name="bio"
              onChange={this.handleChange}
            />
            <button>save bio</button>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          {this.props.bio}
          <button onClick={e => this.setState({ showEditor: true })}>
            edit bio
          </button>
        </div>
      );
    }
  }
}
