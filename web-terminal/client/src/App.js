import {useEffect, useRef} from 'react'
import {XTerm} from 'xterm-for-react'
//import {connectToSocket} from "./helpers";
import io from "socket.io-client";
import './App.css';

function App() {
    const xtermRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        connectToSocket().then((socket) => {

            socketRef.current = socket;
            xtermRef.current.terminal.write("Terminal Connected");
            xtermRef.current.terminal.write("");
            xtermRef.current.terminal.write(`\r\n$ `);

            socketRef.current.on("output", data => {
                // When there is data from PTY on server, print that on Terminal.
                xtermRef.current.terminal.write(data);
            });
        }).catch((e) => {
            console.log('Error Failed to connect to server: ',  e);
        })
        return function cleanup() {
            console.log("cleanup called");
            socketRef.current.close();
            socketRef.current.disconnect();
            xtermRef.current = null;
            socketRef.current = null;
        }
    }, []);

    const onDataCallback = (data) => {
        if(socketRef.current) {
            socketRef.current.emit("input", data);
        }
    }

    const connectToSocket = () => {
        return new Promise(res => {
            const socket = io("http://localhost:8080");
            res(socket);
        });
    }

    return (
        <div id="terminal-container">
            <XTerm
                className={'xterm'}
                ref={xtermRef}
                onData={onDataCallback}
                options={{
                    theme: {
                        background: "#202B33",
                        foreground: "#F5F8FA"
                    }
                }}/>
        </div>
    );
}

export default App;
