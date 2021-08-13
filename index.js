const express = require("express");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");

const server = express();
const app = require("http").createServer(server);
const io = require("socket.io")(app);

server.use(express.static(path.join(__dirname, "public")));
server.set("views", path.join(__dirname, "public"));
server.engine("html", ejs.renderFile);
server.set("view engine", "html");

server.use(cors());

server.get("/", (req, res) => {
  res.render("index.html");
});

let mensagens = [];

io.on("connection", (socket) => {
  console.log(`socket conectado: ${socket.id}`);

  socket.emit("mensagensAnteriores", mensagens);

  socket.on("enviaMensagem", (dados) => {
    console.log(dados);
    mensagens.push(dados);
    socket.broadcast.emit("mensagemRecebida", dados);
  });
});

app.listen(3000);
