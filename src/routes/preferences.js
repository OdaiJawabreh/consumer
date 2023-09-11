const express = require("express");
const {  addPreference,
    updatePreference,
    deletePreference, } = require("../controllers/preferences");
const preferences = express.Router();

preferences.post("/addPreference", addPreference);
preferences.post("/updatePreference", updatePreference);
preferences.post("/deletePreference", deletePreference);

module.exports = preferences;