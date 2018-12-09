import React from "react";

export default function ProfilePic(props) {
    console.log("props: ", props);
    return (
        <div>
            <img
                className="profilePic"
                onClick={props.showUploader}
                src={props.imgUrl}
                alt={props.first + " " + props.last}
            />
        </div>
    );
}

//uso solo l altezza perche mi permette di non distorcere la foto
