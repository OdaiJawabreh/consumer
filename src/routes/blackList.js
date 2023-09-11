const express = require("express");
const {
  addToBlackListFacilityLevel,
  removeFromBlackListFacilityLevel,
  addToBlackListProviderLevel,
  removeFromBlackListProviderLevel,
} = require("../controllers/blackList");
const consumerBlackList = express.Router();

consumerBlackList.post("/addToFacilityList", addToBlackListFacilityLevel);
consumerBlackList.post(
  "/removeFromFacilityList",
  removeFromBlackListFacilityLevel
);
consumerBlackList.post("/addToProviderList", addToBlackListProviderLevel);
consumerBlackList.post(
  "/removeFromProviderList",
  removeFromBlackListProviderLevel
);

module.exports = consumerBlackList;
