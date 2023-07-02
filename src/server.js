import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { count } from "console";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);

app.use("/public", express.static(`${process.cwd()}/src/public`));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  wsServer.sockets.emit("room_change", getPublicRooms());

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const sockets = [];
// const wsServer = new WebSocket.Server({ server });
// wsServer.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => console.log("Disconnected from Browser ❌"));
//   socket.on("message", (stringifiedJson, isBinary) => {
//     const messageObj = JSON.parse(stringifiedJson);
//     switch (messageObj.type) {
//       case "new_message":
//         const message = isBinary
//           ? messageObj.payload
//           : messageObj.payload.toString();
//         sockets.forEach((item) => item.send(`${socket.nickname}: ${message}`));
//         break;
//       case "nickname":
//         socket["nickname"] = isBinary
//           ? messageObj.payload
//           : messageObj.payload.toString();
//         break;
//       default:
//         break;
//     }
//   });
// });

httpServer.listen(PORT, handleListen);
