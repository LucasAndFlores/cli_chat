import { createServer } from "http";
import { v4 } from "uuid";
import { constants } from "./constants.js";

export class SockerServer {
  constructor({ port }) {
    this.port = port;
  }

  async sendMessage(socket, event, message) {
    const data = JSON.stringify({ event, message });

    socket.write(`${data}\n`);
  }

  async initialize(eventEmmitter) {
    const server = createServer((req, res) => {
      res.writeHead(200, { "Content-type": "text/plain" });
      res.end("hey there");
    });

    server.on("upgrade", (req, socket) => {
      socket.id = v4();
      const headers = [
        "HTTP/1.1 101 Web Socket Protocol Handshake",
        "Upgrade: WebSocket",
        "Connection: Upgrade",
        "",
      ]
        .map((line) => line.concat("\r\n"))
        .join("");

      socket.write(headers);
      eventEmmitter.emit(constants.event.NEW_USER_CONNECTED, socket);
    });

    return new Promise((resolve, reject) => {
      server.on("error", reject);
      server.listen(this.port, () => resolve(server));
    });
  }
}
