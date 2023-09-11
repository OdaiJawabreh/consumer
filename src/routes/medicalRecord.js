const express = require("express");
const {
    addMedical, deleteMedical, getMedical
} = require("../controllers/medicalRecord");
const medicalRecord = express.Router();

medicalRecord.post("/addMedical", addMedical);
medicalRecord.post("/deleteMedical", deleteMedical);
medicalRecord.post("/getMedicalRecord", getMedical);

module.exports = medicalRecord;
