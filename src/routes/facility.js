const express = require("express");
const {
  addConsumerFacility,
  getFacilityDetails,
  getBlackListByFacilty,
  getAllConsumerByFacility,
} = require("../controllers/facility");
const consumerFacility = express.Router();

consumerFacility.post("/addFacility", addConsumerFacility);
consumerFacility.post("/getFacilityDetails", getFacilityDetails);
consumerFacility.post("/getAllConsumerByFacility", getAllConsumerByFacility);
consumerFacility.post("/blacklistHistory", getBlackListByFacilty);

module.exports = consumerFacility;
