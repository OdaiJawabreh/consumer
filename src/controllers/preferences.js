const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 

const {
    PreferencesCreate,
  findEntity,
  updateRecordStatus,
} = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addPreference = async (req, res) => {
  // this controller to add EmergencyContact for Consumer
  try {
    const { transactionId, group, key , value , description , startDate, endDate, startTime, endTime, createdBy } =
      req.body;
    const preferenceDTO = {
      id: createTransactionIdOrId("CON-CPF-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CPF-JOR-")
        : transactionId,
        group, key , value , description , startDate, endDate, startTime, endTime, createdBy
    };
    let prefrencesRES = await PreferencesCreate(
      preferenceDTO
    );
    res.status(200).json(prefrencesRES);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const updatePreference = async (req, res) => {
  // this will update EmergencyContact for consumer
  try {
    const {
        transactionId, group, key , value , description , startDate, endDate, startTime, endTime, createdBy,
      id,
    } = req.body;
    // this to current entity based on id
    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "preferences"
    );
    // to check there is address with this id
    if (!lastEntity) {
      return res.status(401).json("No preference With this id");
    }
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "preferences",
      "UPDATED"
    ); // update record status
    // DTO object
    const consumerPreferenceDTO = {
      id,
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CPF-JOR-")
        : transactionId,
      conMtProfileId: conMtProfileId || lastEntity.conMtProfileId,
      group: group || lastEntity.group,
      key: key || lastEntity.key,
      value: value || lastEntity.value,
      group: group || lastEntity.group,
      description: description || lastEntity.description,
      startDate: startDate || lastEntity.startDate,
      endDate: endDate || lastEntity.endDate,
      startTime: startTime || lastEntity.startTime,
      endTime: endTime || lastEntity.endTime,
      createdBy: createdBy || lastEntity.createdBy,
    };
    let preferenceRES = await PreferencesCreate(
        consumerPreferenceDTO
    );
    res.status(200).json(preferenceRES);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const deletePreference = async (req, res) => {
  try {
    // this Api to delete Consumer from emergencyContact list  (Soft Delete) => change recoed status frpm latest to Deleted
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "preferences",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no Preferences with this id ");
    }
    res.json({ id, message: "preference Deleted" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = {
  addPreference,
  updatePreference,
  deletePreference,
};
