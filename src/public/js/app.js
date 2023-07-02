const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
}

getMedia();

function handleMuteClick() {
  if (!muted) {
    muted = true;
    muteBtn.innerText = "Unmute";
  } else {
    muted = false;
    muteBtn.innerText = "Mute";
  }
}
function handleCameraClick() {
  if (!cameraOff) {
    cameraOff = true;
    cameraBtn.innerText = "Turn Camera On";
  } else {
    cameraOff = false;
    cameraBtn.innerText = "Turn Camera Off";
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
