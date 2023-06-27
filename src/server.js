import http from "http";
import SocketIO from "socket.io";
import express from "express";

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

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 1000);
  });
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
