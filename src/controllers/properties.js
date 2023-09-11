const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 
 
const { propertiesConsumer, findEntity, updateRecordStatus } = require("../services/API'S");
const { createTransactionIdOrId, wherJSONId } = require("../../utility/queryBilder/index");

const addPropertiesToConsumer = async (req, res) => {
  // this to add proprotes for consumer like consumer type or reference et...
  try {
    let { conMtProfileId, createdBy, key, value, transactionId, facility } = req.body;
    if (!value) {
      value = { id: '2', name: { ar: 'عادي', en: 'Regular' } };
    }
    let propertiesDTO = {
      id: createTransactionIdOrId("CON-CAD-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId,
      key,
      value,
      createdBy,
      facility
    };
    let properties = await propertiesConsumer(propertiesDTO);
    res.status(200).json(properties);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const updateProperties = async (req, res) => {
  try {
    // this when i want to change any property for consumer such as change tier fro regulat to Gold, etc..
    // notes => we should send id of this entity because all logic build based on it
    const { conMtProfileId, createdBy, key, value, transactionId, id } =
      req.body;
    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "properties"
    ); // to find the current entity with same id as last
    if (!lastEntity) {
      return res.status(401).json("No Properties With this id");
    }
   
    // if user dont sebd any thing DTO will save tha same Data
    let propertiesDTO = {
      id,
      facility: lastEntity.facility, 
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId: conMtProfileId || lastEntity.conMtProfileId,
      key: key || lastEntity.key,
      value: value || lastEntity.value,
      createdBy: createdBy || lastEntity.createdBy,
    };
    // console.log("propertiesDTO", propertiesDTO);
    // console.log("lastEntity", lastEntity);
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "properties",
      "UPDATED"
    );

    let properties = await propertiesConsumer(propertiesDTO);
    res.status(200).json(properties);
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const getDetailsOfTierProperties = async (req, res) => {
  try {
    // this to return a number of all tier type for all consumer By Facilty to use it in charts 
    let facility = req.body.facility
    let properties = await sequelize.models.properties.findAll({
      where: {
       [Op.and]:[
        wherJSONId("facility", facility),
        {recordStatus: "LATEST"},
        {key: "tier"},
       ]
      },
    });
    res.status(200).json(properties)
  } catch (error) {
    res.status(402).json(error.message);
    
  }
}
module.exports = { addPropertiesToConsumer, updateProperties, getDetailsOfTierProperties };
