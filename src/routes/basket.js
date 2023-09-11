const express = require("express");
const { addBasket , updateBasket} = require("../controllers/basket");
const consumerBasket = express.Router();

consumerBasket.post("/addBasket", addBasket);
consumerBasket.post("/updateBasket", updateBasket);

module.exports = consumerBasket;