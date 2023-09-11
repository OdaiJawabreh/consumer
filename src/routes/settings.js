const express = require("express");
const {  addconsumerSetting, getSetting } = require("../controllers/settings");
const consumerSettings = express.Router();

consumerSettings.post("/addSetting", addconsumerSetting);
consumerSettings.post("/getSetting", getSetting);

module.exports = consumerSettings;