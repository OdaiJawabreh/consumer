const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");

const {
  getResponseWithoutPaggination,
  getAddressAndTiersAndEmergencyContact,
} = require("../controllers/consumerProfile");

const { dispatcher } = require("../../utility/requestBilder/requestBilder");

const {
  updateRecordStatus,
  createSegmentApi,
  createCriteriaApi,
  findEntity,
} = require("../services/API'S");
const {
  createTransactionIdOrId,
  wherINJSON,
  arrayOfIds
} = require("../../utility/queryBilder/index");

const createSegment = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      importData,
      createdDate,
      createdBy,
      transactionId,
      criterias,
    } = req.body;
    let segmentDTO = {
      id: createTransactionIdOrId("CON-CSG-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CSG-")
        : transactionId,
      name,
      code,
      type,
      importData,
      createdDate,
      createdBy,
    };
    let result = await createSegmentApi(segmentDTO);
    for (let i = 0; i < criterias.length; i++) {
      let criteria = criterias[i];
      let criteriaDTO = {
        id: createTransactionIdOrId("CON-CSG-JOR-"),
        transactionId: result.transactionId,
        segment: {
          id: result.id,
          name: result.name,
        },
        key: criteria.key,
        value: criteria.value,
      };
      await createCriteriaApi(criteriaDTO);
    }
    res.status(200).json({
      ...result.dataValues,
      criterias,
    });
  } catch (error) {
    res.status(401).json(error.message);

    // console.log(error);
  }
};

const getSegments = async (req, res) => {
  try {
    const { ids, name, code, type, createdDate , filterBy} = req.body;
    let newArr 
    if(filterBy){
     let kh = await getFilterCriteria(req);
     newArr = kh.map((ele)=>(ele.segment.id))
    }
    let segments = await sequelize.models.segment.findAll({
      where: {
        [Op.and]: [
          name
            ? {
                [Op.or]: [
                  wherINJSON("name", "like", "name.ar", name),
                  wherINJSON("name", "like", "name.en", name),
                ],
              }
            : "",
          code ? { code: { [Op.like]: `${code}` } } : "",
          ids ? arrayOfIds("id", ids) : "",
          newArr ? arrayOfIds("id", newArr) : "",
          type ? wherINJSON("type", "eq", "id", type) : "",
          createdDate ? { createdDate: { [Op.eq]: `${createdDate}` } } : "",
          { recordStatus: "LATEST" },
        ],
      },
    });
    if (!segments.length) {
      return res.status(200).json([]);
    }
    let response = await getConsumerSegamnt(segments);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error.message);

    // console.log(error);
  }
};

const updateSegement = async (req, res) => {
  try {
    const {
      id,
      name,
      code,
      type,
      importData,
      createdDate,
      createdBy,
      transactionId,
    } = req.body;
    // this to take last entity for consume because i need to know the values of previos coulmn if i did not update it
    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "segment"
    );
    // to check there is consumer with this id
    if (!lastEntity) {
      return res.status(401).json("No segmqnt With this id");
    }
    let segmentDTO = {
      id,
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CSG-")
        : transactionId,
      name: name || lastEntity.name,
      code: code || lastEntity.code,
      type: type || lastEntity.type,
      importData: importData || lastEntity.importData,
      createdDate: createdDate || lastEntity.createdDate,
      createdBy,
    };
    // update record status from latest to updated
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "segment",
      "UPDATED"
    );
    let result = await createSegmentApi(segmentDTO);
    res.status(200).json(result);
  } catch (error) {
    // console.log(error.message);
    res.status(401).json(error.message);
  }
};

const getFilterCriteria = async (req , res) => {
  try{
    const { filterBy } = req.body;
    let segmentCriteria = await sequelize.models.segmentCriteria.findAll({
      where: {
        key : filterBy ? filterBy : '',
        recordStatus: "LATEST" 
      },
    });
   return segmentCriteria
  }
  catch(error){
    throw error;
  }
};
const deleteSegment = async (req, res) => {
  try {
    // this api to delete Profile (Soft Delete) => change recoed status frpm latest to Deleted
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "segment",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no segment with this id ");
    }
    res.json({ id, message: "Segment Deleted" });
  } catch (error) {
    res.status(402).json({error: error.message});
  }
};

module.exports = {
  createSegment,
  getSegments,
  updateSegement,
  deleteSegment
};

const getConsumerSegamnt = async (segments) => {
  try {
    let arr = [];
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      let criterias = await sequelize.models.segmentCriteria.findAll({
        where: {
          [Op.and]: [
            wherINJSON("segment", "eq", "id", segment.id),
            { recordStatus: "LATEST" },
          ],
        },
      });
      if (criterias.length == 0) {
        arr = [...arr, { ...segment.dataValues, consumers: [] }];
      } else {
        let objFilter = {};
        for (let i = 0; i < criterias.length; i++) {
          let record = criterias[i];
          objFilter[record.key] = record.value;
        }
        // const { data } = await getProfiles(objFilter);
        const { data } = await dispatcher({
          uri: "/consumers/profile/getProfiles",
          body: objFilter,
        });

        arr = [...arr, { ...segment.dataValues, consumers: [...data.rows] }];
      }
    }
    return arr;
  } catch (error) {
    throw error;
  }
};

const getProfiles = async (data) => {
  try {
    // this function to get profile where all condition

    let response = await getResponseWithoutPaggination(data);
    // if thers no consumer
    if (!response.rows.length) {
      return response;
    }
    // now i will go to find all address fro every consumer
    let result = await getAddressAndTiersAndEmergencyContact(response.rows);
    response.rows = [...result];
    return response;
  } catch (error) {
    throw error;
  }
};
