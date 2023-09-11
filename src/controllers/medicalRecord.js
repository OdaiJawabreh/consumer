const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
const { createMedicalRecord , updateRecordStatus } = require("../services/API'S");
const { createTransactionIdOrId , wherINJSON} = require("../../utility/queryBilder/index");
const addMedical = async (req, res) => {
  // this controller to add attachment for consumer
  try {
    const {  consumer, recordType,dateFrom ,dateTo, subject ,description,attachments,medicine,provider, transactionId, createdBy } = req.body;
    const medicalDTO = {
      id: createTransactionIdOrId("CON-CMR-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CMR-JOR-")
        : transactionId,
     consumer, recordType,dateFrom ,dateTo, subject ,description,attachments,medicine, createdBy,provider 
    };
    let record = await createMedicalRecord(medicalDTO);
    res.status(200).json(record);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const deleteMedical= async (req, res) => {
//   this to delete related member
  try {
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "medicalRecord",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no related with this id ");
    }
    res.json({ id, message: "Related Deleted" });
  } catch (error) {}
};
const getMedical = async (req, res) =>{
  try{
    const { consumerId , providerId } = req.body;
  let calendarInfo = await sequelize.models.medicalRecord.findAll({
    where: {
      [Op.and]: [
        wherINJSON("consumer", "eq", "id", consumerId ),
        wherINJSON("provider", "eq", "id", providerId ),
        { recordStatus: "LATEST" },
      ],
    },
  });
    res.status(200).json(calendarInfo)
  }catch(error){
    res.status(402).json(error.message);
  }
};
module.exports = { addMedical, deleteMedical , getMedical };