const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
const res = require("express/lib/response");
const { updateRecordStatus ,findEntity , addConsumerToFacility } = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");
const { addProvidersToConsumers } = require('../services/provider')
const {
  wherJSONId,
} = require("../../utility/queryBilder/index");
const updateConsumerProvider = async (req, res) => {
  // this controller to add events for Skill events
  try {
    const {
      id,
      conMtProfileId,
      provider,
      createdBy,
    } = req.body;

    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "Provider"
    );
    if (!lastEntity) {
      return res.status(401).json("No Provider With this id");
    }

    let providerDTO = {
      id,
      transactionId: createTransactionIdOrId("TRN-CON-PRV-JOR-"),
      conMtProfileId : conMtProfileId? conMtProfileId : lastEntity.conMtProfileId,
      provider : provider ? provider : lastEntity.provider ,
      createdBy : createdBy ? createdBy : lastEntity.createdBy,
    };
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "Provider",
      "UPDATED"
    );
    let providerr = await addProvidersToConsumers(providerDTO);
    res.status(200).json(providerr);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const addProvider = async (req, res) => {
  // this controller to add events for Consumer events
  try {
    const {
      consumer,
      provider,
      transactionId,
      facility,
      createdBy,
    } = req.body;
    let checkProvider;
    let Provider ;
    //we need to check facility to add consumer to facility if he didn't add yet 
    if(consumer &&
        provider){
            let checkConsumerFacility = await sequelize.models.facility.findAll({
                where: {
                  conMtProfileId:consumer.id,
                 recordStatus: "LATEST" 
                },
              });
              console.log(checkConsumerFacility);
              if(!checkConsumerFacility){
                console.log(checkConsumerFacility ,'no facility')
                const consumerFacilityDTO = {
                    id: createTransactionIdOrId("CON-PRV-JOR-"),
                    transactionId: !transactionId
                      ? createTransactionIdOrId("TRN-CON-PRV-JOR-")
                      : transactionId,
                    conMtProfileId: consumer?.id,
                    facility: facility,
                    createdBy,
                  };
               await addConsumerToFacility(consumerFacilityDTO)
              }
                  checkProvider = await sequelize.models.Provider.findAll({
                      where: {
                          [Op.and]: [
                             { conMtProfileId:consumer.id},
                             provider ? wherJSONId("provider", provider) : "",
                            { recordStatus: "LATEST" }
                          ]
                             },
                });
                if(!checkProvider){
                  let ProviderDTO = {
                    id: createTransactionIdOrId("CON-PRV-JOR-"),
                    transactionId: !transactionId
                      ? createTransactionIdOrId("TRN-CON-PRV-JOR-")
                      : transactionId,
                    conMtProfileId : consumer ? consumer.id : '',
                    provider,
                    createdBy,
                  }
                  Provider = await addProvidersToConsumers(ProviderDTO);
                }
        }
      res.status(200).json(Provider || "this provider is exist for this consumer");

  } catch (error) {
    res.status(402).json(error.message);
  }
};

const getProviders = async(req , res) => {
  try{
    let provider = await sequelize.models.Provider.findAll({
      where: {
        conMtProfileId:req.body.conMtProfileId,
       recordStatus: "LATEST" 
      },
    });
    res.status(200).json(provider);
  }
  catch(error){
    res.status(402).json(error.message);
  }
};

module.exports = {getProviders, addProvider , updateConsumerProvider};
