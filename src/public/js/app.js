const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      cameraSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    myFace.srcObject = myStream;
    await getCameras();
  } catch (error) {
    console.log(error);
  }
}

getMedia();

function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = false));
  if (!muted) {
    muted = true;
    muteBtn.innerText = "Unmute";
  } else {
    muted = false;
    muteBtn.innerText = "Mute";
  }
}

function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = false));
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
