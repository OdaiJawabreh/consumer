

const { AttachmentsToConsumer, updateRecordStatus } = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addAttachmenConsumer = async (req, res) => {
  // this controller to add attachment for consumer
  try {
    const {
      transactionId,
      conMtProfileId,
      type,
      image,
      description,
      date,
      facility,
      createdBy,
    } = req.body;
    const consumerAttachmentDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      type,
      image,
      description,
      date,
      facility,
      createdBy,
    };
    let ConsumerAttachment = await AttachmentsToConsumer(consumerAttachmentDTO);
    res.status(200).json(ConsumerAttachment);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const deleteAttachment = async (req, res) => {
  // this Api To delete attachments from consumer attachments Soft Delete
  try {
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "attachments",
      "DELETED"
    );
    if (result[0]=='0'){
      return res.status(401).json("There is no attachmrnt with this id ")
    }
    res.json({ id, message: "Attachments Deleted" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = { addAttachmenConsumer, deleteAttachment };
