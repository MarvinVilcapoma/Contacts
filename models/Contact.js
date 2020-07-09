const { Schema, model } = require("mongoose");

const Contacto = new Schema(
  {
    nombre: { type: String,required: true },
    apellido: { type: String, required: true },
    email:{ type: String, required: true},
    fecha_nacimiento: { type: String, required: true},
    imageUrl : { type: String },
    public_id : { type: String },
    user: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = model("contacts", Contacto);
