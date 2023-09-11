const express = require("express");
const {  addPropertiesToConsumer, updateProperties, getDetailsOfTierProperties } = require("../controllers/properties");
const consumerProperties = express.Router();

consumerProperties.post("/addProperty", addPropertiesToConsumer);
consumerProperties.post("/updateProperty", updateProperties);
consumerProperties.post("/tierDetails", getDetailsOfTierProperties);

module.exports = consumerProperties;