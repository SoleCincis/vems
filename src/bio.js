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
  // talks with index.js , right?
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    axios
      .post("/history/bio", this.state)
      .then(resp => {
        this.props.setBio(this.state.bio);
      })
      .catch(err => console.log("error in bio: ", err));
  }
  render() {
    return (
      <div>
        {this.props.bio}

        <form onSubmit={this.handleSubmit}>
          <textarea name="bio" onChange={this.handleChange} />
          <button>save</button>
        </form>

        <button onClick={this.hideEditor}>hide B</button>
        <button onClick={this.showEditor}>your bio</button>
        <button onClick={this.showEditor}>edit your B</button>
      </div>
    );
  }
}
