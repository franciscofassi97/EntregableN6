const express = require("express");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 8080;

const { Server: HttpServer } = require("http");
const { Server: IoServer } = require("socket.io");
const httpServer = new HttpServer(app);
const ioSocket = new IoServer(httpServer);

// const routersProducts = require("./routers/productsRouters");

//CONTENEDOR
const Contenedor = require("./model/Contenedor");
const contenedorProducts = new Contenedor("productos.json");
const contenedorMessage = new Contenedor("message.json");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

// app.use("/api/productos", routersProducts);

app.get("/", (req, res) => {
  res.redirect("/api/productos");
});

app.get("/api/productos", (req, res) => {
  res.render("formProducts");
});

//--------SOKETS-------------

ioSocket.on("connection", async (socket) => {
  console.log("new Cliente connected");

  socket.emit("leerProductos", await contenedorProducts.getAll());
  socket.emit("leerMessage", await contenedorMessage.getAll());
  //Products
  socket.on("newProduct", async (product) => {
    const idProduct = await contenedorProducts.save(product);
    if (idProduct) {
      ioSocket.sockets.emit("leerProductos", await contenedorProducts.getAll());
    }
  });

  //Chat
  socket.on("newMessage", async (message) => {
    const idMessage = await contenedorMessage.save(message);
    if (idMessage) {
      ioSocket.sockets.emit("leerMessage", await contenedorMessage.getAll());
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
