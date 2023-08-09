const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;


const asociadaSchema = new Schema({
  idcarrera: {
    type: ObjectId,
    required: true,
  },
  iduniversidad: {
    type: ObjectId,
    required: true,
  }
});

module.exports = mongoose.model("asociada", asociadaSchema);
