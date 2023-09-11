const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
 
const {} = require("../services/API'S");
const {
  wherJSONLike,
  wherJSONId,
} = require("../../utility/queryBilder/index");

 

const universalSearch = async (req, res) => {
  try {
    // universal Search by consumer
    const key = req.body.key;
    let result = []; // this to push data under standerd
    if (!key) {
      return res.status(401).json("send Key");
    }
    let profilesCount = await sequelize.models.consumer.findAll({
      where: {
        [Op.or]: [
          // this where condition in table profile

          wherJSONLike("first_name", "en", key),
          wherJSONLike("first_name", "ar", key),
          wherJSONLike("middle_name", "ar", key),
          wherJSONLike("middle_name", "en", key),
          wherJSONLike("last_name", "en", key),
          wherJSONLike("last_name", "ar", key),
          { email: { [Op.like]: `${key}` } },
          wherJSONLike("primary_phone", "number", key),
          wherJSONLike("secondery_phone", "number", key),
          wherJSONId("gender", key),
          wherJSONId("martial_status", key),
          wherJSONId("nationality", key),
          wherJSONId("occupation", key),
        ],
        recordStatus: "LATEST",
      },
    });
    if (profilesCount.length) {
      profilesCount.forEach((consumer) => {
        result.push({
          category: "consumers",
          id: consumer.id,
          image: consumer.image,
          label1: "Name",
          value1: consumer.firstName,
          label2: "Number",
          value2: consumer.primaryPhone,
          label3: "Email",
          value3: consumer.email,
          label4: "Gender",
          value4: consumer.gender,
        });
      });
      return res.status(200).json(result);
    } else {
      return res.status(200).json(profilesCount);
    }
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

module.exports = { universalSearch };
