const express = require("express");
const {  universalSearch } = require("../controllers/universalSearch");
const consumerUniversalSearch = express.Router();

consumerUniversalSearch.post("/universalSearch", universalSearch);

module.exports = consumerUniversalSearch;