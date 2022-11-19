const socket = io("http://localhost", {
  transports: ["polling"],
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4QGVtYWlsLmNvbSJ9.21wxAFSTNTw9SaUaFPkdOq_PmEe5ZGW-QsypUVDKg9I",
  },
});
console.log("Socket: ", socket);

socket.on("statusUpdate", (data) => {
  console.log(data);
});

socket.on("refresh", () => {
  socket.emit("status");
});

const statusButton = document.getElementById("status-button");
statusButton.addEventListener("click", () => {
  socket.emit("status");
});
