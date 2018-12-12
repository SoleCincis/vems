import * as io from "socket.io-client"; // client-side library
import { onlineUsers } from "./actions";
let socket;
//if user have already a socket open, don't open a new one
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        //most of our client-side socket code will go here
        //on is event listener that accept 2 arguments
        //first is the name of the message :
        //must be the same agument thas i pass in my function on the server
        socket.on("onlineUsers", users => {
            // from server the value of this function
            //is going to be any data that i want to send
            //in my "message" using this method emit

            store.dispatch(onlineUsers(users));
        });
    }
    return socket;
}
