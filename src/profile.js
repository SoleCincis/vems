import React from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Bio from "./bio";

export default function Profile(props) {
  console.log(props);
  return (
    <div className="profile-container">
      <ProfilePic
        imgUrl={props.imgUrl}
        first={props.first}
        last={props.last}
        showUploader={() => props.showUploader()}
      />
      <div>
        <h1>
          Buon giorno {props.first} {props.last}
        </h1>
        <Bio bio={props.bio} setBio={props.setBio} />
      </div>
    </div>
  );
}
