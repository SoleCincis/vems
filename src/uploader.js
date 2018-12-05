import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
  constructor(props) {
    console.log("miaaaaa");
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.files[0]
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("handle submit running!");

    var formData = new FormData();
    formData.append("file", this.state.file);

    var self = this;
    axios
      .post("/upload", formData)
      .then(resp => {
        console.log(resp.data);
        self.props.updateImage(resp.data.results.imgurl);
      })
      .catch(err => {
        this.setState({ error: true });
        console.log("error while uploading image: ", err);
      });
  }

  render() {
    return (
      <div>
        <h1>upload an image!</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            name="file"
            onChange={this.handleChange}
            type="file"
            accept="image/*"
          />
          <button>upload</button>
        </form>
      </div>
    );
  }
}
