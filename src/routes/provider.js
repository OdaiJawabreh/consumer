const express = require("express");
const { getProviders, addProvider , updateConsumerProvider} = require("../controllers/provider");
const consumerProvider = express.Router();


consumerProvider.post("/addConsumerProvider", addProvider);
consumerProvider.post("/getConsumerProviders", getProviders);
consumerProvider.post("/updateConsumerProvider", updateConsumerProvider);

module.exports = consumerProvider;