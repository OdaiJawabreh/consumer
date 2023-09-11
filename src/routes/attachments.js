const express = require("express");
const {  addAttachmenConsumer, deleteAttachment } = require("../controllers/attachments");
const consumerAttachment = express.Router();

consumerAttachment.post("/addAttachment", addAttachmenConsumer);
consumerAttachment.post("/deleteAttachment", deleteAttachment);

module.exports = consumerAttachment;