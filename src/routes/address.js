const express = require("express");
const {  addAddress, updateAddress, deleteAddress,addressCharts } = require("../controllers/address");
const consumerAddress = express.Router();

consumerAddress.post("/addAddress", addAddress);
consumerAddress.post("/updateAddress", updateAddress);
consumerAddress.post("/deleteAddress", deleteAddress);
consumerAddress.post("/addressCharts", addressCharts);

module.exports = consumerAddress;