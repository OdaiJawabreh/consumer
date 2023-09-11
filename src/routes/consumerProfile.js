const express = require("express");
const {
  createProfile,
  getProfiles,
  getFullProfile,
  updateProfile,
  deleteProfile,
  addImages,
  checkConsumer,
} = require("../controllers/consumerProfile");
const consumerProfile = express.Router();

consumerProfile.post("/createProfile", createProfile);
consumerProfile.post("/getProfiles", getProfiles);
consumerProfile.post("/getFullProfile", getFullProfile);
consumerProfile.post("/updateProfile", updateProfile);
consumerProfile.post("/deleteProfile", deleteProfile);
consumerProfile.post("/addImages", addImages);
consumerProfile.post("/checkConsumer", checkConsumer);

module.exports = consumerProfile;
