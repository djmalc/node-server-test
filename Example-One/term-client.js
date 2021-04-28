import { XTerm } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";

class ClientTerm {
  constructor(opts) {
    const xTerm = new XTerm();
    const fitAddon = new FitAddon();
    const attachAddon = new AttachAddon();
    xTerm.loadAddon("attach");
    txTerm.loadAddon("fit");

    sendSizeToServer = () => {
      let cols = this.term.cols.toString();
      let rows = this.term.rows.toString();
      while (cols.length < 3) {
        cols = "0" + cols;
      }
      while (rows.length < 3) {
        rows = "0" + rows;
      }
      this.socket.send("ESCAPED|-- RESIZE:" + cols + ";" + rows);
    };

    term = new xTerm({
      cols: 80,
      rows: 24,
    });
    term.open(document.getElementById(opts.parentId), true);

    let sockHost = opts.host || "127.0.0.1";
    let sockPort = opts.port || 8080;

    socket = new WebSocket("ws://" + sockHost + ":" + sockPort);
    socket.onopen = () => {
      term.attach(this.socket);
    };
    socket.onerror = (e) => {
      throw e;
    };

    fit = () => {
      term.fit();
      setTimeout(() => {
        sendSizeToServer();
      }, 50);
    };

    resize = (cols, rows) => {
      term.resize(cols, rows);
      sendSizeToServer();
    };
  }
}

export default ClientTerm;
