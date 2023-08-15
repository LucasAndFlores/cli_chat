import { EventEmitter } from "events";
import { TerminalController } from "./TerminalController.js";
import { CliConfig } from "./CliConfig.js";
import { SocketClient } from "./SocketClient.js";
import { EventManager } from "./EventManager.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
const componentEmmitter = new EventEmitter();
const socketClient = new SocketClient(config);
await socketClient.initialize();
const eventManager = new EventManager({ componentEmmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);
const data = {
  roomId: config.room,
  userName: config.username,
};

eventManager.joinRoomAndWaitForMessages(data);
const controller = new TerminalController();
await controller.initializeTable(componentEmmitter);
