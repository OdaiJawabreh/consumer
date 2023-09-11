const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 
 
const { addConsumerToFacility } = require("../services/API'S");
const {
  createTransactionIdOrId,
  wherJSONId,
} = require("../../utility/queryBilder/index");

const addConsumerFacility = async (req, res) => {
  // this controller to connect any consumer to spacifi facilty
  try {
    const { conMtProfileId, facility, joiningDate, createdBy, transactionId } =
      req.body;
    const consumerFacilityDTO = {
      id: createTransactionIdOrId("CON-CNF-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNF-JOR-")
        : transactionId,
      conMtProfileId,
      facility,
      joiningDate,
      createdBy,
    };
    let ConsumerToFacility = await addConsumerToFacility(consumerFacilityDTO);
    res.status(200).json(ConsumerToFacility);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const getFacilityDetails = async (req, res) => {
  // this Api to find all consumer with joining date in spacific Facilty to used this date in stastic
  try {
    let facility = req.body.facility;
    let finalResult = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };
    let giveDeletedConsumer = await sequelize.models.facility.findAll({
      where: {
        [Op.and]: [wherJSONId("facility", facility)], // based on facility came from body
      },
      group: ["conMtProfileId"], // if we have to record wit same consumer (not duplicated)
    });
    // this just to Know in any dtae joined
    if (giveDeletedConsumer.length) {
      giveDeletedConsumer.forEach((consumer) => {
        let x = consumer.createdAt + "";
        let arr = x.split(" ")[1];
        finalResult[`${arr}`]++;
      });
    }
    res
      .status(200)
      .json([
        finalResult.Jan,
        finalResult.Feb,
        finalResult.Mar,
        finalResult.Apr,
        finalResult.May,
        finalResult.Jun,
        finalResult.Jul,
        finalResult.Aug,
        finalResult.Sep,
        finalResult.Oct,
        finalResult.Nov,
        finalResult.Dec,
      ]);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const getBlackListByFacilty = async (req, res) => {
  try {
    // this Api to Get the Black List in facilty Level By months
    let facility = req.body.facility;
    // console.log("fa", facility);
    let finalResult = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };
    let BlackListRecords = await sequelize.models.blackList.findAll({
      where: {
        [Op.and]: [wherJSONId("blocker", facility), wherJSONId("action", 1)],
      },
    });
    if (BlackListRecords.length) {
      BlackListRecords.forEach((consumer) => {
        // this to Know every consumer when was Blocked
        let x = consumer.createdAt + "";
        // console.log(x);
        let arr = x.split(" ")[1];
        finalResult[`${arr}`]++;
      });
      return res
        .status(200)
        .json([
          finalResult.Jan,
          finalResult.Feb,
          finalResult.Mar,
          finalResult.Apr,
          finalResult.May,
          finalResult.Jun,
          finalResult.Jul,
          finalResult.Aug,
          finalResult.Sep,
          finalResult.Oct,
          finalResult.Nov,
          finalResult.Dec,
        ]);
    } else {
      return res.status(200).json(finalResult);
    }
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const getAllConsumerByFacility = async (req, res) => {
  try {
    // this to get all consumer based on facility to acces joining date bt consumer
    let facility = req.body.facility;
    let consumers = await sequelize.models.facility.findAll({
      where: {
        [Op.and]: [
          wherJSONId("facility", facility),
          { recordStatus: "LATEST" },
        ],
      },
    });
    res.status(200).json(consumers)
  } catch (error) {
    res.status(402).json(error.message)
  }
};
module.exports = {
  addConsumerFacility,
  getFacilityDetails,
  getBlackListByFacilty,
  getAllConsumerByFacility
};
