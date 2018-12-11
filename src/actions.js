import axios from "./axios";

export async function getListOfFriendsAndWannabes() {
    const { data } = await axios.get("/wannabes/friends"); //users
    return {
        type: "LIST_OF_FRIENDS_WANNABES",
        friendsWannabes: data //req.session.userId
    };
}

export async function deleteFriend(id) {
    //const { data } = await axios.get("/delete/friendRequest");
    return {
        type: "UNFRIEND",
        notfriends: id // ?????
    };
}

export async function acceptFriend(id) {
    await axios.post("/accept/friendRequest");
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        yesFriends: id //????????????????
    };
}
