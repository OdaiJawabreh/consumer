const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
const {
  emergencyContactToConsumer,
  findEntity,
  updateRecordStatus,
} = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addEmergencyContact = async (req, res) => {
  // this controller to add EmergencyContact for Consumer
  try {
    const { transactionId, conMtProfileId, name, relation, phone, createdBy } =
      req.body;
    const consumerEmergenctContactDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      name,
      relation,
      phone,
      createdBy,
    };
    let ConsumerToEstablishment = await emergencyContactToConsumer(
      consumerEmergenctContactDTO
    );
    res.status(200).json(ConsumerToEstablishment);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const updateEmergencyContact = async (req, res) => {
  // this will update EmergencyContact for consumer
  try {
    const {
      transactionId,
      conMtProfileId,
      name,
      relation,
      phone,
      createdBy,
      id,
    } = req.body;
    // this to current entity based on id
    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "emergencyContact"
    );
    // to check there is address with this id
    if (!lastEntity) {
      return res.status(401).json("No EmergencyContact With this id");
    }
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "emergencyContact",
      "UPDATED"
    ); // update record status
    // DTO object
    const consumerEmergenctContactDTO = {
      id,
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId: conMtProfileId || lastEntity.conMtProfileId,
      name: name || lastEntity.name,
      relation: relation || lastEntity.relation,
      phone: phone || lastEntity.phone,
      createdBy: createdBy || lastEntity.createdBy,
    };
    let ConsumerToEstablishment = await emergencyContactToConsumer(
      consumerEmergenctContactDTO
    );
    res.status(200).json(ConsumerToEstablishment);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const deleteEmergencyContact = async (req, res) => {
  try {
    // this Api to delete Consumer from emergencyContact list  (Soft Delete) => change recoed status frpm latest to Deleted
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "emergencyContact",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no Emergrcy Contsct with this id ");
    }
    res.json({ id, message: "EmergencyContact Deleted" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = {
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
};
