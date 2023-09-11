
const { Op, where, DATE } = require("sequelize");
 

const { addConsumerToEstablishment } = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addConsumerEstablishment = async (req, res) => {
  // this controller to connect any consumer to spacifi facilty
  try {
    const { transactionId, conMtProfileId, joiningDate, establishment, createdBy } = req.body;
    const consumerEstablishmentDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId ?  createTransactionIdOrId("TRN-CON-CNE-JOR-") : transactionId ,
      conMtProfileId,
      joiningDate,
      establishment,
      createdBy
    
    };
    let ConsumerToEstablishment = await addConsumerToEstablishment(consumerEstablishmentDTO);
    res.status(200).json(ConsumerToEstablishment);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = { addConsumerEstablishment };
