import * as io from "socket.io-client"; // client-side library
import { onlineUsers, userJoined, userLeft } from "./actions";
let socket;
//if user have already a socket open, don't open a new one
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        //most of our client-side socket code will go here
        //on is event listener that accept 2 arguments
        //first is the name of the message :
        //must be the same agument thas i pass in my function on the server
        // from server the value of this function
        //is going to be any data that i want to send
        //in my "message" using this method emit

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });
        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });
        socket.on("userLeft", userId => {
            store.dispatch(userLeft(userId));
        });
    }
    return socket;
}
