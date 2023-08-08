const Inventario = require("../models/inventario");
const Categoria = require("../models/categoria");

const createInventario = async (req, res) => {
  try {
    var { nombre, categoria, cantidad } = req.body;

    var _categoria = categoria;
    var _nombre = nombre;
    var _cantidad = parseInt(cantidad);

    //CATEGORIA
    categoria = await Categoria.findOne({ nombre: categoria }, { _id: 1 });
    if (categoria == null) {
      nombre = _categoria;
      categoria = new Categoria({ nombre });
      categoria = await categoria.save();
      categoria = await Categoria.findOne({ nombre: nombre }, { _id: 1 });
    }
    categoria = categoria._id;

    // PRODUCTO
    nombre = _nombre;
    cantidad = _cantidad;
    producto = await Inventario.findOne({ nombre: nombre }, { _id: 1 });
    if (producto == null) {
      producto = new Inventario({
        nombre,
        categoria,
        cantidad,
      });
    } else {
      // UPDATE
      producto = await Inventario.findOne({ nombre: nombre }, { cantidad: 1 });
      cantidad += producto.cantidad;
      id = producto._id;
      producto = await Inventario.findByIdAndUpdate(
        id,
        {
          nombre,
          categoria,
          cantidad,
        },
        { new: true }
      );
    }

    producto = await producto.save();

    return res.status(201).send(producto);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const getInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.aggregate([
      {
        $lookup: {
          from: "categorias",
          localField: "categoria",
          foreignField: "_id",
          as: "inventarioDocs",
        },
      },
      {
        $unwind: "$inventarioDocs",
      },
      {
        $project: {
          nombre: 1,
          categoria: "$inventarioDocs.nombre",
          cantidad: 1,
        },
      },
    ]);

    if (inventarios.length === 0) {
      // console.log("ERROR")
      return res
        .status(404)
        .send({ message: "No se han encontrado Inventario registrados" });
    }

    return res.status(200).send(inventarios);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const update = async (req, res) => {
  try {
    var { action } = req.params;
    var { nombre, categoria, cantidad } = req.body;
    var producto = await Inventario.findOne(
      { nombre: nombre },
      { _id: 1, nombre: 1, categoria: 1, cantidad: 1 }
    );

    var query = await Categoria.findOne({ nombre: categoria }, { _id: 1 });
    if (query == null) {
      new Categoria({ categoria });
      categoria = await Categoria.findOne({ nombre: nombre }, { _id: 1 });
    }
    categoria = categoria._id;

    if (producto != null) {
      cantidad = parseInt(cantidad);
      if (action === "remove") {
        cantidad = producto.cantidad - cantidad;
      }
      if (action === "add") {
        cantidad += producto.cantidad;
      }
      var id = producto._id;

      producto = await Inventario.findByIdAndUpdate(
        id,
        {
          nombre: nombre,
          categoria: categoria,
          cantidad: cantidad,
        },
        {
          new: true,
        }
      );
    }
    producto = await producto.save();
    if (!producto) {
      return res.status(404).send({ message: "No se encontró el producto" });
    }

    return res.status(201).send(producto);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

const updateInventario = async (req, res) => {
  try {
    const { id } = req.params;
    var { nombre, categoria, cantidad } = req.body;

    var query = await Categoria.findOne({ nombre: categoria }, { _id: 1 });
    if (query == null) {
      new Categoria({ categoria });
      categoria = await Categoria.findOne({ nombre: nombre }, { _id: 1 });
    }
    categoria = categoria._id;
    cantidad = parseInt(cantidad);

    // Si cambia el nombre del producto
    query = await Inventario.find({ nombre: nombre }, { id: 1 });

    const inventario = await Inventario.findByIdAndUpdate(
      id,
      {
        nombre: nombre,
        categoria: categoria,
        cantidad: cantidad,
      },
      {
        new: true,
      }
    );

    if (!inventario) {
      return res.status(404).send({ message: "No se encontró el paciente" });
    }

    return res.status(201).send(inventario);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const deleteInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findByIdAndDelete(id);

    if (!inventario) {
      return res.status(404).send({ message: "No se encontró el paciente" });
    }

    return res.status(200).send({ message: "Paciente eliminado" });
  } catch (error) {
    return res.status(400).send({ message: "No se elimino al paciente" });
  }
};

const buscarPorRut = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findOne({ id: id }).exec();
    if (!inventario) {
      return res
        .status(404)
        .send({ message: "No se han encontrado al paciente" });
    }
    return res.status(201).send(inventario);
  } catch (error) {
    return res.status(400).send({ message: "No se realizo la busqueda" });
  }
};

const buscarPorNombre = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventario.findOne({ id: id }).exec();
    if (!inventario) {
      return res
        .status(404)
        .send({ message: "No se han encontrado al paciente" });
    }
    return res.status(201).send(inventario);
  } catch (error) {
    return res.status(400).send({ message: "No se realizo la busqueda" });
  }
};

module.exports = {
  createInventario,
  getInventarios,
  updateInventario,
  deleteInventario,
  buscarPorRut,
  buscarPorNombre,
  update,
};
