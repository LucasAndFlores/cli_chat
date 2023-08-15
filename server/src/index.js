import { SockerServer } from "./SocketServer.js";
import { EventEmitter } from "events";
import { constants } from "./constants.js";
import { Controller } from "./Controller.js";

const eventEmmiter = new EventEmitter();
const port = process.env.PORT || 9898;
const socketServer = new SockerServer({ port });
const server = await socketServer.initialize(eventEmmiter);
const controller = new Controller({ socketServer });

eventEmmiter.on(
  constants.event.NEW_USER_CONNECTED,
  controller.onNewConnection.bind(controller)
);

console.log("Server is running at", server.address().port);
