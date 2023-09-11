const express = require("express");
const {  addConsumerEstablishment } = require("../controllers/establishment");
const consumerEstablishment = express.Router();

consumerEstablishment.post("/addEstablishment", addConsumerEstablishment);

module.exports = consumerEstablishment;