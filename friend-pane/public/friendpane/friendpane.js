const socket = io();
console.log("Socket connected: ", socket);

socket.on("pong", (data) => {
  document.getElementById("socket-info").innerText +=
    "Message received: " + data.message + "\n";
});

function sendPing() {
  console.log("Sending Ping");
  const data = document.getElementById("socket-data-input").value;
  socket.emit("ping", { message: data });
}
