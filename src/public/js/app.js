const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  room.hidden = false;
  welcome.hidden = true;
  const messageForm = room.querySelector("#message");
  const nameForm = room.querySelector("#name");
  messageForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (username) => {
  addMessage(`${username} arrived!`);
});

socket.on("bye", (username) => {
  addMessage(`${username} lefted...`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (openRooms) => {
  const openRoomList = welcome.querySelector("ul");
  openRoomList.innerHTML = "";
  if (openRooms.length === 0) {
    return;
  }
  openRooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    openRoomList.append(li);
  });
});
