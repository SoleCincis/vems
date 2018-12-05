import React from "react";

export default function ProfilePic(props) {
  console.log("props: ", props);
  return (
    <div>
      <h1>Welcome to profile pic, {props.first}</h1>
      <img onClick={props.showUploader} src={props.imgUrl} height="200" />
    </div>
  );
}

//uso solo l altezza perche mi permette di non distorcere la foto
