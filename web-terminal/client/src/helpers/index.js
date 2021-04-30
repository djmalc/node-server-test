import io from "socket.io-client";

export function connectToSocket() {
    return new Promise(res => {
        const socket = io("http://localhost:8080");
        res(socket);
    });
}

