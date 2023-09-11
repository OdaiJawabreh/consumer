const { sequelize } = require("../../models/index");


const { BlackListAction } = require("../services/API'S");
const {
  createTransactionIdOrId,
} = require("../../utility/queryBilder/index");

const addToBlackListFacilityLevel = async (req, res) => {
  // this controller to add consumer to balck list in clinic level
  try {
    const {
      transactionId,
      conMtProfileId,
      blocker,
      reason,
      requestedBy,
      requester,
      date,
      notes,
      facility,
      createdBy,
    } = req.body;
    const blackListDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      blockedBy: { id: 1, name: { ar: "منشأة", en: "facilty" } }, // this static because the Function is working onlt for one case
      blocker,
      action: { id: 1, name: { ar: "حظر", en: "Block" } }, // this static because the Function is working onlt for one case
      reason,
      requestedBy,
      requester,
      date,
      notes,
      facility,
      createdBy,
    };
    let blackList = await BlackListAction(blackListDTO);
    res.status(200).json(blackList);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const removeFromBlackListFacilityLevel = async (req, res) => {
  // this controller to Remove consumer from balck list in clinic level
  try {
    const {
      transactionId,
      conMtProfileId,
      blocker,
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    } = req.body;
    const blackListDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      blockedBy: { id: 1, name: { ar: "منشأة", en: "facilty" } }, // this static because the Function is working onlt for one case
      blocker,
      action: { id: 2, name: { ar: "الغاء الحظر", en: "Un Block" } }, // this static because the Function is working onlt for one case
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    };
    let blackList = await BlackListAction(blackListDTO);
    res.status(200).json(blackList);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const addToBlackListProviderLevel = async (req, res) => {
  // this controller to add consumer to balck list in Provider Level
  try {
    const {
      transactionId,
      conMtProfileId,
      blocker,
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    } = req.body;
    const blackListDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      blockedBy: { id: 2, name: { ar: "مقدم خدمة", en: "Provider" } }, // this static because the Function is working onlt for one case
      blocker,
      action: { id: 1, name: { ar: "حظر", en: "Block" } }, // this static because the Function is working onlt for one case
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    };
    let blackList = await BlackListAction(blackListDTO);
    res.status(200).json(blackList);
  } catch (error) {
    res.status(402).json(error.message);
  }
};

const removeFromBlackListProviderLevel = async (req, res) => {
  // this controller to add consumer to balck list in Provider Level
  try {
    const {
      transactionId,
      conMtProfileId,
      blocker,
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    } = req.body;
    const blackListDTO = {
      id: createTransactionIdOrId("CON-CNE-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNE-JOR-")
        : transactionId,
      conMtProfileId,
      blockedBy: { id: 2, name: { ar: "مقدم خدمة", en: "Provider" } }, // this static because the Function is working onlt for one case
      blocker,
      action: { id: 2, name: { ar: "الغاء الحظر", en: "Un Block" } }, // this static because the Function is working onlt for one case
      reason,
      requestedBy,
      requester,
      date,
      notes,
      createdBy,
    };
    let blackList = await BlackListAction(blackListDTO);
    res.status(200).json(blackList);
  } catch (error) {
    res.status(402).json(error.message);
  }
};



module.exports = {
  addToBlackListFacilityLevel,
  removeFromBlackListFacilityLevel,
  addToBlackListProviderLevel,
  removeFromBlackListProviderLevel,
};

/* 
  try {
    let id = req.body.id;
    let facilty = req.body.facility;
    let status;
    console.log(id, facilty);
    let result = await sequelize.models.blackList.findAndCountAll({
      where: {
        [Op.and]: [
          facilty ? wherJSONId("blocker", facilty) : "",
          id ? { conMtProfileId: { [Op.eq]: id } } : "",
        ],
      },
    });

    result.rows.length
      ? (status = "The Consumer does not Black list now")
      : result.rows[result.rows.length - 1].action.name.en == "Block"
      ? (status = "The Consumer Now is Blocked at facility Level")
      : (status = "The Consumer does not Black list now");
      res.send({status, ...result});
  } catch (error) {
    res.send(error);
  } 
 */

  /*
    try {
    let response = []
    let id = req.body.id;
    let result = await sequelize.models.blackList.findAll({
      attributes: [
        [sequelize.json("blocker.id"), "providerId"],
        [sequelize.fn("COUNT", sequelize.col("blocker")), "count"],
      ],
      where: {
        [Op.and]: [
          wherJSONId("blocked_by", 2),
          { conMtProfileId: { [Op.eq]: id } },
        ],
      },
      group: [sequelize.json("blocker.id")],
    });
    for (let i = 0; i < result.length; i++) {
      let history = await sequelize.models.blackList.findAll({
        where: {
          [Op.and]: [
            wherJSONId("blocked_by", 2),
            { conMtProfileId: { [Op.eq]: id } },
            wherJSONId("blocker", result[i].dataValues.providerId),

          ],
        }
      })
      response.push({history: history, status: result[i]})
     
    }
    res.send(response)
  } catch (error) {
    res.status(401).json(error.message);
  }  
  */
