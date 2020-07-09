const express = require("express");
const router = express.Router();

// Controller
const {
  renderContactForm,
  createNewContact,
  renderContacts,
  renderEditForm,
  updateContact,
  deleteContact
} = require("../controllers/contact.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// New Contact
router.get("/contacts/add", isAuthenticated, renderContactForm);

router.post("/contacts/new-contacts", isAuthenticated, createNewContact);
  
// Get All Contacts
router.get("/contacts", isAuthenticated, renderContacts);

// Edit Contacts
router.get('/contacts/edit/:id', isAuthenticated, renderEditForm);

router.put("/contacts/edit/:id", isAuthenticated, updateContact);

// Delete Contacts
router.delete("/contacts/delete/:id", isAuthenticated, deleteContact);

module.exports = router;
