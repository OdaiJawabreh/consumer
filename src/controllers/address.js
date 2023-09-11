
const { Op, where, DATE } = require("sequelize");
const {
  addAddressToProfile,
  findEntity,
  updateRecordStatus,
  

  
} = require("../services/API'S");
const { createTransactionIdOrId, wherJSONId } = require("../../utility/queryBilder/index");

const addAddress = async (req, res) => {
  // this function to add address to consumer profile
  try {
    const {
      conMtProfileId,
      country,
      city,
      area,
      landmark,
      street,
      building,
      primary,
      createdBy,
      transactionId,
    } = req.body;

    const consumerAddressDTO = {
      id: createTransactionIdOrId("CON-CAD-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId,
      country,
      city,
      area,
      landmark,
      street,
      building,
      primary,
      createdBy,
    };
    let addAddress = await addAddressToProfile(consumerAddressDTO);
    res.status(200).json(addAddress);
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const updateAddress = async (req, res) => {
  // this Api To Update one or more Address
  try {
    const {
      id,
      conMtProfileId,
      country,
      city,
      area,
      landmark,
      street,
      building,
      primary,
      createdBy,
      transactionId,
    } = req.body;
    // this to current entity based on id
    let lastEntity = await findEntity(
      { id, recordStatus: "LATEST" },
      "address"
    );
    // to check there is address with this id
    if (!lastEntity) {
      return res.status(401).json("No address With this id");
    }
    const consumerAddressDTO = {
      id,
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId: conMtProfileId || lastEntity.conMtProfileId,
      country: country || lastEntity.country,
      city: city || lastEntity.city,
      area: area || lastEntity.area,
      landmark: landmark || lastEntity.landmark,
      street: street || lastEntity.street,
      building: building || lastEntity.building,
      primary: primary || lastEntity.primary,
      createdBy: createdBy || lastEntity.createdBy,
    };
    await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "address",
      "UPDATED"
    );
    let addAddress = await addAddressToProfile(consumerAddressDTO);
    res.status(200).json(addAddress);
  } catch (error) {
    res.status(404).json(error.message);
  }
};
const deleteAddress = async (req, res) => {
  try {
    // this api to delete Profile (Soft Delete) => change recoed status frpm latest to Deleted
    const id = req.body.id;
    let result = await updateRecordStatus(
      { id, recordStatus: "LATEST" },
      "address",
      "DELETED"
    );
    if (result[0] == "0") {
      return res.status(401).json("There is no attachmrnt with this id ");
    }
    res.json({ id, message: "Addres Deleted" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const addressCharts = async (req, res) => {
  try {
    let id = req.body.id
    let obj = {};
    let allAdressByArea = await sequelize.models.address.findAll({
      where: {
        [Op.and]: [
          wherJSONId('city', id),
          { recordStatus: "LATEST" },
        ],
      },
      attributes: ["area"],
    });
  
    if (allAdressByArea.length > 0) {
      allAdressByArea.forEach((consumer) => {
        obj[`${consumer.dataValues.area.name.en}`]
          ? obj[`${consumer.dataValues.area.name.en}`]++
          : (obj[`${consumer.dataValues.area.name.en}`] = 1);
      });

      return res.json({
        area: Object.keys(obj),
        values: Object.values(obj),
      });
    }
    return res.json([]);
    // res.status(200).json(allAdressByArea);
  } catch (error) {
    res.status(402).json(error.message);
  }
};
module.exports = { addAddress, updateAddress, deleteAddress, addressCharts };
