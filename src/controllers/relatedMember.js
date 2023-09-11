const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 
 
const { relatedConsumer, updateRecordStatus } = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addRelated = async (req, res) => {
  // this controller to add attachment for consumer
  try {
    const { master, sub, relation, date, transactionId, createdBy } = req.body;
    const relatedDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      master,
      sub,
      relation,
      date,
    };
    let related = await relatedConsumer(relatedDTO);
    res.status(200).json(related);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const deleteRelated = async (req, res) => {
  // this to delete related member
  try {
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "relatedMembers",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no related with this id ");
    }
    res.json({ id, message: "Related Deleted" });
  } catch (error) {}
};

module.exports = { addRelated, deleteRelated };
