const express = require("express");
const {  addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = require("../controllers/emergencyContact");
const consumerEmergenctContact = express.Router();

consumerEmergenctContact.post("/addEmergencyContact", addEmergencyContact);
consumerEmergenctContact.post("/updateEmergencyContact", updateEmergencyContact);
consumerEmergenctContact.post("/deleteEmergencyContact", deleteEmergencyContact);

module.exports = consumerEmergenctContact;