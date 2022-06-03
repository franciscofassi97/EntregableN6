const socket = io();

const createProducto = () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;

  const product = { title, price, thumbnail };

  socket.emit("newProduct", product);
  return false;
};

socket.on("leerProductos", (allProducts) => {
  if (allProducts.length > 0) {
    document.getElementById("tbodyProductos").innerHTML = "";
    document.getElementById("divErrors").innerHTML = "";
    for (let i = 0; i < allProducts.length; i++) {
      let producto = allProducts[i];
      let productoHTML = `
        <tr>
          <td>${producto.title}</td>
          <td>${producto.price}</td>
          <td><img style="width: 50px; height:50px" src=${thumbnail} alt=""></td>
        </tr>
      `;
      document.getElementById("tbodyProductos").innerHTML += productoHTML;
    }
  } else {
    document.getElementById("divErrors").innerHTML =
      "<h1>No hay Productos</h1>";
  }
});

const onMessage = () => {
  const mail = document.getElementById("mail").value;
  const message = document.getElementById("message").value;
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();

  const messsage = { mail, message, date: date + " " + time };

  socket.emit("newMessage", messsage);
  return false;
};

socket.on("leerMessage", (allMessages) => {
  if (allMessages.length > 0) {
    document.getElementById("messagesDiv").innerHTML = "";
    console.log(message);
    for (let i = 0; i < allMessages.length; i++) {
      let message = allMessages[i];
      let messageHTML = `
      <p><spam><strong>${message.mail}</strong> </spam>
      <spam class="date">${message.date} </spam> :
      <spam class="message">${message.message}</spam></p>
      `;
      document.getElementById("messagesDiv").innerHTML += messageHTML;
    }
  } else {
    document.getElementById("messagesDiv").innerHTML =
      "<h1>No hay Mensajes</h1>";
  }
});
