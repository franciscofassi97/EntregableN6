const fs = require("fs");

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
  }

  save = async (object) => {
    try {
      let arrayObject = [];

      if (fs.existsSync(this.nombreArchivo)) {
        const allData = await this.getAll();
        const id = allData[allData.length - 1].id + 1;
        object.id = id;
        allData.push(object);
        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify(allData)
        );
        return object.id;
      } else {
        object.id = 1;
        arrayObject.push(object);
        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify(arrayObject)
        );
        return object.id;
      }
    } catch (error) {
      console.log(`Error al guardar el objeto: ${error}`);
    }
  };

  getAll = async () => {
    try {
      let data = await fs.promises.readFile(this.nombreArchivo, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer todos los objectos");
      return [];
    }
  };
}

module.exports = Contenedor;
