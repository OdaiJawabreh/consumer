const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 
 
const { consumerSettings } = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");

const addconsumerSetting = async (req, res) => {
  // this Api i used it to define all setting related to consumer Like blocked Action, availability, attachment_type, etc ..
  try {
    const {
      createdBy,
      transactionId,
      tier,
      attachmentType,
      availability,
      blockAction,
      referredBy,
      blockBy,
      recordType,
      blockRequester,
      segmentType,
      filterCratiria,
      itemType
    } = req.body;
    let consumerSettingsDTO = {
      id: createTransactionIdOrId("CON-CAD-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      tier,
      attachmentType,
      availability,
      blockAction,
      referredBy,
      blockBy,
      recordType,
      blockRequester,
      createdBy,
      segmentType,
      filterCratiria,
      itemType
    };
    let calender = await consumerSettings(consumerSettingsDTO);
    res.status(200).json(calender);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const getSetting = async (req, res) => {
  try {
    // get all asettings for consumer feature
    let settings = await sequelize.models.setting.findOne({
      where: {
        recordStatus: "LATEST",
      },
    });
    res.status(200).json(settings);

  } catch (error) {
    res.status(402).json(error.message);
  }
};

module.exports = { addconsumerSetting, getSetting };
