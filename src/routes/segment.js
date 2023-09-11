const express = require("express");
const {  createSegment , getSegments, updateSegement , deleteSegment} = require("../controllers/segment");
const consumerSegment = express.Router();

consumerSegment.post("/createSegment", createSegment);
consumerSegment.post("/getSegments", getSegments);
// consumerSegment.post("/getConsumersSeqment", getConsumersSeqment);
consumerSegment.post("/updateSegement", updateSegement);
consumerSegment.post("/deleteSegment", deleteSegment);

module.exports = consumerSegment;