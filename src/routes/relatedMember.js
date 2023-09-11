const express = require("express");
const {  addRelated , deleteRelated} = require("../controllers/relatedMember");
const consumerRelated = express.Router();

consumerRelated.post("/addRelatedMember", addRelated);
consumerRelated.post("/deleteRelatedMember", deleteRelated);

module.exports = consumerRelated;