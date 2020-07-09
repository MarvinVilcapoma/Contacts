const contactsCtrl = {};
const express = require('express');
const router = express.Router();

// Models
const Contact = require("../models/Contact");
const { request } = require('../server');

contactsCtrl.renderContactForm = (req, res) => {
  res.render("contacts/new-contacts");
};

contactsCtrl.createNewContact = async (req, res) => {
  const { nombre, apellido, email, fecha_nacimiento, image } = req.body;
  const errors = [];
  if (!nombre) {
    errors.push({ text: "Escribir un nombre valido" });
  }
  if (!apellido) {
    errors.push({ text: "Escribir un apellido valido" });
  }
  if (!email){
    errors.push({ text: "Escribir un correo electronico valido"});
  }
  if(!fecha_nacimiento){
      errors.push({ text: "Escribir una fecha de nacimiento válida"});
  }
  if (errors.length > 0) {
    res.render("contacts/new-contacts", {
      errors,
      nombre,
      apellido,
      email,
      fecha_nacimiento,
      image
    });
  } else {
    const newContact = new Contact({ nombre, apellido, email, fecha_nacimiento, image });
    newContact.user = req.user.id;
    await newContact.save();
    req.flash("success_msg", "Contacto agregado correctamente");
    res.redirect("/contacts");
  }
};

contactsCtrl.renderContacts = async (req, res) => {
  const contacts = await Contact.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("contacts/all-contacts", { contacts });
};

contactsCtrl.renderEditForm = async (req, res) => {
  const contacts = await Contact.findById(req.params.id).lean();
  console.log(contacts)
  res.render("contacts/edit-contacts", { contacts });
};

contactsCtrl.updateContact = async (req, res) => {
  const { nombre, apellido, email, fecha_nacimiento, image } = req.body;
  await Contact.findByIdAndUpdate(req.params.id, { nombre, apellido, email, fecha_nacimiento, image });
  req.flash("success_msg", "Contacto actualizado");
  res.redirect("/contacts");
};

contactsCtrl.deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Contacto Eliminado Correctamente");
  res.redirect("/contacts");
};

module.exports = contactsCtrl;

