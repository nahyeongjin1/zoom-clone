import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);

app.use("/public", express.static(`${process.cwd()}/src/public`));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from Browser ❌"));
  socket.on("message", (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    console.log(message);
  });
  socket.send("Hello!!");
});

server.listen(PORT, handleListen);
