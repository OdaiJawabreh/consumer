const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
const { createProfileApi, propertiesConsumer, addConsumerToEstablishment, addConsumerToFacility, updateRecordStatus, findEntity } = require("../services/API'S");
const { createTransactionIdOrId, wherJSONLike, wherJSONId, arrayOfIds, whereBetween, wherINJSON } = require("../../utility/queryBilder/index");

//sequelize.sync();

const createProfile = async (req, res) => {
  // this function to add basic profile to Consumer
  try {
    const {
      firstName,
      middleName,
      lastName,
      image,
      dob,
      gender,
      martialStatus,
      nationality,
      occupation,
      identification,
      status,
      cimMtUserId,
      primaryPhone,
      seconderyPhone,
      bloodType,
      email,
      dependent,
      website,
      socialMedia,
      createdBy,
      property,
      facility,
      establishment,
      referredBy,
      joiningDate,
      transactionId,
      isVerify,
    } = req.body;
    firstName.en = firstName?.en.toLowerCase();
    firstName.ar = firstName?.ar.toLowerCase();
    lastName.en = lastName?.en.toLowerCase();
    lastName.ar = lastName?.ar.toLowerCase();
    let checkConsumerExist = await sequelize.models.consumer.findOne({
      where: {
        [Op.and]: [wherINJSON("primary_phone", "eq", "number", primaryPhone.number), { recordStatus: "LATEST" }],
      },
    });
    let response;
    console.log(checkConsumerExist);
    if (!checkConsumerExist && primaryPhone && gender && firstName && lastName) {
      let consumerDTO = {
        id: createTransactionIdOrId("CON-CNP-JOR-"),
        transactionId: transactionId || createTransactionIdOrId("TRN-CON-CNP-JOR-"),
        firstName,
        middleName,
        lastName,
        image,
        dob,
        gender,
        martialStatus,
        nationality,
        occupation,
        identification,
        status,
        cimMtUserId,
        primaryPhone,
        seconderyPhone,
        bloodType,
        email,
        website,
        dependent,
        socialMedia,
        createdBy,
        isVerify,
      };
      response = await createProfileApi(consumerDTO);
    }
    if (checkConsumerExist || response) {
      let infacility = await sequelize.models.facility.findOne({
        where: {
          conMtProfileId: checkConsumerExist ? checkConsumerExist.id : "",
          recordStatus: "LATEST",
        },
      });
      if (!infacility && facility) {
        let facilityDTO = {
          id: createTransactionIdOrId("CON-CNF-JOR-"),
          transactionId: !transactionId ? createTransactionIdOrId("TRN-CON-CNF-JOR-") : transactionId,
          conMtProfileId: response?.dataValues?.id || checkConsumerExist?.id,
          facility,
          joiningDate,
          createdBy: createdBy,
        };
        await addConsumerToFacility(facilityDTO);
      }
      let inEstablishment = await sequelize.models.establishment.findOne({
        where: {
          conMtProfileId: checkConsumerExist ? checkConsumerExist.id : "",
          recordStatus: "LATEST",
        },
      });
      if (!inEstablishment && establishment) {
        let establishmentDTO = {
          id: createTransactionIdOrId("CON-CNE-JOR-"),
          transactionId: !transactionId ? createTransactionIdOrId("TRN-CON-CNE-JOR-") : transactionId,
          conMtProfileId: response?.dataValues?.id || checkConsumerExist?.id,
          joiningDate,
          establishment,
          createdBy,
        };
        addConsumerToEstablishment(establishmentDTO);
      }
      let propertyExist = await sequelize.models.properties.findOne({
        where: {
          conMtProfileId: checkConsumerExist ? checkConsumerExist.id : "",
          recordStatus: "LATEST",
        },
      });
      if (!propertyExist && property) {
        let propertyDTO = {
          id: createTransactionIdOrId("CON-CAD-JOR-"),
          transactionId: !transactionId ? createTransactionIdOrId("TRN-CON-CNP-JOR-") : transactionId,
          conMtProfileId: response?.dataValues?.id || checkConsumerExist?.id,
          facility,
          key: property?.key || "tier",
          value: property?.value || { id: "2", name: { ar: "عادي", en: "Regular" } },
          createdBy: createdBy,
        };
        await propertiesConsumer(propertyDTO);
      }
      res.status(202).json({ response: checkConsumerExist || response });
    } else {
      res.status(200).json("missing keys to create consumer");
    }
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const getProfiles = async (req, res) => {
  try {
    // this function to get profile where all condition
    let { limit, offset } = req.body;

    if (limit && offset) {
      limit = limit * 1;
      offset = (offset * 1 - 1) * limit;
      let response = await getResponsePaggination(req, limit, offset);
      // if thers no consumer
      if (!response.rows.length) {
        return res.status(200).json(response);
      }
      // now i will go to find all address fro every consumer because address in other table
      let result = await getAddressAndTiersAndEmergencyContact(response.rows);
      response.rows = [...result];
      res.status(200).json(response);
    } else {
      let response = await getResponseWithoutPaggination(req);
      // if thers no consumer
      if (!response.rows.length) {
        return res.status(200).json(response);
      }
      // now i will go to find all address fro every consumer
      let result = await getAddressAndTiersAndEmergencyContact(response.rows);
      response.rows = [...result];
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const getFullProfile = async (req, res) => {
  /* 
      this api to get all of Details obut consumer in master table and all relational 
      Tablefierst of all i want to get the pasic information about the consumer
     from amaster Table after it i eill go to every relation Table
      to get all infromation about this user */
  try {
    let { id, facility } = req.body;
    let consumer = await sequelize.models.consumer.findOne({
      where: {
        id,
        [Op.or]: [{ recordStatus: "LATEST" }, { recordStatus: "DELETED" }],
      },
    });
    // if no any consumer with this id i will return an error from here no need to complete all codes
    if (!consumer) {
      return res.status(400).json({ message: "No any Consumer With ID " + id });
    }

    const [address, emergencyContact, attachments, relatedMember, medicalRecords, blackListFacilty, blackListProvider, properties, calender, basket, facilityDetails] = await Promise.all([
      // im using Promis beacuse this is more faster if all support function siprated and no any function depend on other
      getAddressForConsumer(id), // now i want to get address for the consumer from address Table.
      getEmergencyCotact(id), // now i want to get Emergency Conatct for the consumer from Emergency Conatct  Table.
      getAttachments(id), // now i want to get Attachment for the consumer from  Attachment  Table.
      getRelatedConsumer(id), // now i want to get all related Member from consumer and from other Consumer
      getMedicalRecords(id), //get medical records
      getBlackListHistoryFacility(id, facility), // now i want to find the blacklist Histro for linic level and the status of consumer
      getBlackListHistoryProvider(id), // now i want to find the blacklist Histroy for all providers in spcific consumer abd the current status
      getConsumerProperties(id, facility), // give me the properties of consumer such as tier or referredBy etc...
      getCalender(id), // give me the calender of consumer
      getBasket(id), // give me the basket of consumer
      getFacilityDetails(id, facility), // give facility details like join date
    ]);

    res.status(200).send({
      generalInfo: {
        ...consumer.dataValues,
        name: {
          ar: consumer.dataValues.firstName.ar + " " + consumer.dataValues.lastName.ar,
          en: consumer.dataValues.firstName.en + " " + consumer.dataValues.lastName.en,
        },
        properties,
        facilityDetails,
      },
      address,
      emergencyContact,
      attachments,
      relatedMember,
      medicalRecords,
      blackListFacilty,
      blackListProvider,
      calender,
      basket,
    });
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const updateProfile = async (req, res) => {
  try {
    const {
      id,
      firstName,
      middleName,
      lastName,
      image,
      dob,
      gender,
      martialStatus,
      nationality,
      occupation,
      identification,
      status,
      created_by,
      cimMtUserId,
      primaryPhone,
      seconderyPhone,
      bloodType,
      email,
      website,
      socialMedia,
      createdBy,
      isVerify,
      completed,
    } = req.body;

    // this to take last entity for consume because i need to know the values of previos coulmn if i did not update it
    let lastEntity = await findEntity({ id, recordStatus: "LATEST" }, "consumer");
    if (firstName && lastName) {
      firstName.en = firstName ? firstName?.en.toLowerCase() : lastEntity.firstName.en;
      firstName.ar = firstName ? firstName?.ar.toLowerCase() : lastEntity.firstName.ar;
      lastName.en = lastName ? lastName?.en.toLowerCase() : lastEntity.lastName.en;
      lastName.ar = lastName ? lastName?.ar.toLowerCase() : lastEntity.lastName.ar;
    }
    // to check there is consumer with this id
    if (!lastEntity) {
      return res.status(401).json("No consumer With this id");
    }
    let consumerDTO = {
      id,
      transactionId: req.body.transaction_id || createTransactionIdOrId("TRN-CON-CNP-JOR-"),
      firstName: firstName || lastEntity.firstName,
      middleName: middleName || lastEntity.middleName,
      lastName: lastName || lastEntity.lastName,
      image: image || lastEntity.image,
      dob: dob || lastEntity.dob,
      gender: gender || lastEntity.gender,
      dependent: lastEntity.dependent,
      martialStatus: martialStatus || lastEntity.martialStatus,
      nationality: nationality || lastEntity.nationality,
      occupation: occupation || lastEntity.occupation,
      identification: identification || lastEntity.identification,
      status: status || lastEntity.status,
      bloodType: bloodType || lastEntity.bloodType,
      created_by: created_by || lastEntity.created_by,
      cimMtUserId: cimMtUserId || lastEntity.cimMtUserId,
      primaryPhone: primaryPhone || lastEntity.primaryPhone,
      seconderyPhone: seconderyPhone || lastEntity.seconderyPhone,
      email: email || lastEntity.email,
      website: website || lastEntity.website,
      socialMedia: socialMedia || lastEntity.socialMedia,
      createdBy: createdBy || lastEntity.createdBy,
      isVerify: isVerify !== undefined ? isVerify : lastEntity.isVerify,
      completed: completed ? completed : lastEntity.completed,
    };
    // update record status from latest to updated
    await updateRecordStatus({ id, recordStatus: "LATEST" }, "consumer", "UPDATED");

    let response = await createProfileApi(consumerDTO);
    res.status(200).json(response);
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const deleteProfile = async (req, res) => {
  try {
    // this api to delete Profile (Soft Delete) => change recoed status frpm latest to Deleted based On Facility
    const { id } = req.body;
    let result = await updateRecordStatus({ [Op.and]: [{ id }, { recordStatus: "LATEST" }] }, "consumer", "DELETED");
    //  to delete consumer from facility
    let result1 = await updateRecordStatus({ [Op.and]: [{ conMtProfileId: id }, { recordStatus: "LATEST" }] }, "facility", "DELETED");
    //  to delete consumer propirites from facility
    let result3 = await updateRecordStatus({ [Op.and]: [{ conMtProfileId: id }, { recordStatus: "LATEST" }] }, "properties", "DELETED");
    if (result[0] == "0" || result1[0] == "0" || result3[0] == "0") {
      return res.status(401).json("There is no  with this id ");
    }
    res.json({ id, message: "Consumer Deleted" });
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const addImages = async (req, res) => {
  try {
    // this to add the link of DMS image direct when creat consumer with the same entity
    const { image, id, identification } = req.body;
    await sequelize.models.consumer.update(
      { image, identification },

      { where: { id, recordStatus: "LATEST" } }
    );
    res.status(200).json("Added Successfuly");
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};
const checkConsumer = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, gender, facility, createdBy } = req.body;
    const { number } = phoneNumber;
    // first of all i need to check if have this consumer in consumer profiles table?
    let checkConsumer = await sequelize.models.consumer.findOne({
      where: {
        [Op.and]: [wherINJSON("primary_phone", "eq", "number", number), { recordStatus: "LATEST" }],
      },
    });
    if (checkConsumer) {
      // i want to check if belongs to the same facility or not
      let checkFacility = await sequelize.models.facility.findOne({
        where: {
          [Op.and]: [{ conMtProfileId: checkConsumer.id }, wherINJSON("facility", "eq", "id", facility), { recordStatus: "LATEST" }],
        },
      });
      if (checkFacility) return res.status(200).json(checkFacility);
      let facilityDTO = {
        id: createTransactionIdOrId("CON-CNF-JOR-"),
        transactionId: createTransactionIdOrId("TRN-CON-CNF-JOR-"),
        conMtProfileId: checkConsumer.id,
        facility: {
          id: facility,
        },
        joiningDate: todayDate(),
        createdBy,
      };
      addConsumerToFacility(facilityDTO);
      return res.status(200).json(checkConsumer);
    } else {
      let consumerDTO = {
        id: createTransactionIdOrId("CON-CNP-JOR-"),
        transactionId: createTransactionIdOrId("TRN-CON-CNP-JOR-"),
        firstName: {
          "ar": firstName,
          "en":firstName
        },
        lastName: {
          "ar": lastName,
          "en":lastName
        },
        gender,
        primaryPhone: phoneNumber,
        createdBy,
      };

      let response = await createProfileApi(consumerDTO);

      let facilityDTO = {
        id: createTransactionIdOrId("CON-CNF-JOR-"),
        transactionId: createTransactionIdOrId("TRN-CON-CNF-JOR-"),
        conMtProfileId: response.id,
        facility: {
          id: facility,
        },
        joiningDate: todayDate(),
        createdBy,
      };
      addConsumerToFacility(facilityDTO);
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log("error in checkConsumer controller", error.message);
    res.status(401).json(error.message);
  }
};

const getResponsePaggination = async (req, limit, offset, res) => {
  /* this finction to get consumer Profile with filter and without filter and return pasic profile without relational Table */
  let addressIds = []; // i decleared this to push ids if i have filter on address and i make it because i wnt to filter in if statment scope
  let ages = null; // i decleared this to push date of birth range
  let facilityIds = []; // i decleared this to push all consumer with one facility
  let establishmentIds = []; // i decleared this to push all consumer with one establishment
  let tiersIds = []; // i decleared this to push all consumer with spacific Tiers
  try {
    const {
      ids,
      language,
      firstName,
      lastName,
      name,
      gender,
      martialStatus,
      nationality,
      occupation,
      primaryPhone,
      bloodType,
      ageFrom,
      ageTo,
      email,
      facility,
      cimMtUserId,
      establishment,
      //address
      country,
      city,
      area,
      // tiers
      tiers,
      dependent,
    } = req.body;
    if (tiers) {
      tiersIds = await getBasedOnTiers(tiers);
    }

    // to check if we need to filter on address because i have address in other Table
    typeof country == "object" || typeof city == "object" || typeof area == "object" ? (addressIds = await getBasedOnAddress({ country, city, area })) : "";
    // to check if send age from or age To
    ageTo || ageFrom ? (ages = await dateOfBirth(ageFrom, ageTo)) : "";
    // to check if i need consumers group for any facilty
    facility ? (facilityIds = await getConsumersByFacility(facility)) : "";
    // to check if he wants all Consumer belon to establishment
    establishment ? (establishmentIds = await getConsumersByEstablishment(establishment)) : "";
    //Fitima First comment
    let space = name ? name?.indexOf(" ") : null;
    let firstPartName = space ? name?.substring(0, space) : "";
    let lastPartName = space ? name?.substring(space + 1) : "";
    let profilesCount = await sequelize.models.consumer.findAndCountAll({
      where: {
        [Op.and]: [
          // this where condition in table profile
          // firstName ? wherJSONLike("first_name", language, firstName) : "",
          firstName
            ? {
                [Op.or]: [wherJSONLike("first_name", "ar", firstName), wherJSONLike("first_name", "en", firstName)],
              }
            : "",
          lastName
            ? {
                [Op.or]: [wherJSONLike("last_name", "ar", lastName), wherJSONLike("last_name", "en", lastName)],
              }
            : "",
          name
            ? {
                [Op.or]: [
                  name
                    ? {
                        [Op.or]: [wherJSONLike("first_name", "ar", firstPartName || name), wherJSONLike("first_name", "en", firstPartName || name)],
                      }
                    : "",
                  lastPartName
                    ? {
                        [Op.or]: [wherJSONLike("last_name", "ar", lastPartName), wherJSONLike("last_name", "en", lastPartName)],
                      }
                    : "",
                ],
              }
            : "",
          email ? { email: { [Op.like]: `${email}` } } : "",
          primaryPhone ? wherJSONLike("primary_phone", "number", primaryPhone) : "",
          gender ? wherJSONId("gender", gender) : "",
          martialStatus ? wherJSONId("martial_status", martialStatus) : "",
          nationality ? wherJSONId("nationality", nationality) : "",
          occupation ? wherJSONId("occupation", occupation) : "",
          bloodType ? wherJSONId("bloodType", bloodType) : "",
          ids ? arrayOfIds("id", ids) : "",
          country || city || area ? arrayOfIds("id", addressIds) : "",
          ageFrom && ageTo ? whereBetween("dob") : "",
          facility ? arrayOfIds("id", facilityIds) : "",
          establishment ? arrayOfIds("id", establishmentIds) : "",
          cimMtUserId ? { cimMtUserId: cimMtUserId } : "",
          tiers ? arrayOfIds("id", tiersIds) : "",
          dependent ? { dependent: { [Op.eq]: `${dependent}` } } : "",
          { recordStatus: "LATEST" },
        ],
      },
      limit,
      offset,
    });
    finalresponse = profilesCount.rows.map((profile) => {
      // console.log(profile.dataValues);
      return {
        ...profile.dataValues,
        name: {
          ar: profile.dataValues.firstName.ar + " " + profile.dataValues.lastName.ar,
          en: profile.dataValues.firstName.en + " " + profile.dataValues.lastName.en,
        },
      };
    });

    return {
      pages: Math.ceil(profilesCount.count / limit),
      rows: [...finalresponse],
    };
    // return { pages: Math.ceil(profilesCount.count / limit), ...profilesCount };
  } catch (error) {
    throw error;
  }
};
const getResponseWithoutPaggination = async (req, res) => {
  /* this finction to get consumer Profile with filter and without filter and return pasic profile without relational Table */
  let addressIds = []; // i decleared this to push ids if i have filter on address and i make it because i wnt to filter in if statment scope
  let ages = null; // i decleared this to push date of birth range
  let facilityIds = []; // i decleared this to push all consumer with one facility
  let establishmentIds = []; // i decleared this to push all consumer with one establishment
  let tiersIds = []; // i decleared this to push all consumer with spacific Tiers

  try {
    const {
      ids,
      name,
      firstName,
      lastName,
      gender,
      martialStatus,
      nationality,
      occupation,
      primaryPhone,
      ageFrom,
      ageTo,
      email,
      facility,
      establishment,
      dependent,
      bloodType,
      cimMtUserId,
      //address
      country,
      city,
      area,
      // tiers
      tiers,
    } = req.body;

    if (tiers) {
      tiersIds = await getBasedOnTiers(tiers);
    }
    // to check if we need to filter on address because i have address in other Table
    typeof country == "object" || typeof city == "object" || typeof area == "object" ? (addressIds = await getBasedOnAddress({ country, city, area })) : "";

    // to check if send age from or age To
    ageTo || ageFrom ? (ages = await dateOfBirth(ageFrom, ageTo)) : "";
    // to check if i need consumers group for any facilty
    facility ? (facilityIds = await getConsumersByFacility(facility)) : "";
    // to check if he wants all Consumer belon to establishment
    establishment ? (establishmentIds = await getConsumersByEstablishment(establishment)) : "";
    let space = name ? name?.indexOf(" ") : null;
    let firstPartName = space ? name?.substring(0, space) : "";
    let lastPartName = space ? name?.substring(space + 1) : "";
    let profilesCount = await sequelize.models.consumer.findAndCountAll({
      where: {
        [Op.and]: [
          // this where condition in table profile
          firstName
            ? {
                [Op.or]: [wherJSONLike("first_name", "en", firstName), wherJSONLike("first_name", "ar", firstName)],
              }
            : "",
          lastName
            ? {
                [Op.or]: [wherJSONLike("last_name", "ar", lastName), wherJSONLike("last_name", "en", lastName)],
              }
            : "",
          name
            ? {
                [Op.or]: [
                  name
                    ? {
                        [Op.or]: [wherJSONLike("first_name", "ar", firstPartName), wherJSONLike("first_name", "en", firstPartName)],
                      }
                    : "",
                  name
                    ? {
                        [Op.or]: [wherJSONLike("last_name", "ar", lastPartName), wherJSONLike("last_name", "en", lastPartName)],
                      }
                    : "",
                ],
              }
            : "",
          email ? { email: { [Op.like]: `${email}` } } : "",
          primaryPhone ? wherJSONLike("primary_phone", "number", primaryPhone) : "",
          gender ? wherJSONId("gender", gender) : "",
          martialStatus ? wherJSONId("martial_status", martialStatus) : "",
          nationality ? wherJSONId("nationality", nationality) : "",
          occupation ? wherJSONId("occupation", occupation) : "",
          bloodType ? wherJSONId("bloodType", bloodType) : "",
          ids ? arrayOfIds("id", ids) : "",
          country || city || area ? arrayOfIds("id", addressIds) : "",
          ageFrom && ageTo ? whereBetween("dob", ages) : "",
          // {cimMtUserId : cimMtUserId ? cimMtUserId : ""},
          cimMtUserId ? { cimMtUserId: cimMtUserId } : "",
          tiers ? arrayOfIds("id", tiersIds) : "",
          facility ? arrayOfIds("id", facilityIds) : "",
          establishment ? arrayOfIds("id", establishmentIds) : "",
          dependent ? { dependent: { [Op.eq]: `${dependent}` } } : "",
          { recordStatus: "LATEST" },
        ],
      },
    });
    finalresponse = profilesCount.rows.map((profile) => {
      // console.log(profile.dataValues);
      return {
        ...profile.dataValues,
        name: {
          ar: profile.dataValues.firstName.ar + " " + profile.dataValues.lastName.ar,
          en: profile.dataValues.firstName.en + " " + profile.dataValues.lastName.en,
        },
      };
    });
    // console.log({ count: profilesCount.count, rows: [...finalresponse] });
    return { count: profilesCount.count, rows: [...finalresponse] };
    // console.log("finalresponse => ", ...finalresponse);
    // return { count: profilesCount.count, rows : [...finalresponse] };
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
// filter based on tiers
const getBasedOnTiers = async (tiers) => {
  try {
    let response = await sequelize.models.properties.findAll({
      where: {
        [Op.and]: [{ key: "tier" }, wherINJSON("value", "in", "id", tiers), { recordStatus: "LATEST" }],
      },
      // group: ["conMtProfileId"],
    });
    // console.log(response.map((consumer) => consumer.conMtProfileId));
    // console.log(response);
    return response.map((consumer) => consumer.conMtProfileId);
  } catch (error) {
    throw error;
  }
};
// filter on address
const getBasedOnAddress = async ({ country, city, area }) => {
  // this function to filter on addrees details
  try {
    let response = await sequelize.models.address.findAll({
      where: {
        [Op.and]: [
          country ? wherINJSON("country", "in", "id", country) : "",
          city ? wherINJSON("city", "in", "id", city) : "",
          area ? wherINJSON("area", "in", "id", area) : "",
          { recordStatus: "LATEST" },
        ],
      },
      // group: ["conMtProfileId"],
    });
    // console.log(response)
    return response.map((consumer) => consumer.conMtProfileId);
  } catch (error) {
    throw error;
  }
};

// find address for each consumer and tier
const getAddressAndTiersAndEmergencyContact = async (consumers) => {
  // for loop in every entity and found the address for each one from table
  try {
    let array = [];
    for (let i = 0; i < consumers.length; i++) {
      let address = await sequelize.models.address.findAll({
        where: { conMtProfileId: consumers[i].id, recordStatus: "LATEST" },
      });
      let emergencyContact = await sequelize.models.emergencyContact.findAll({
        where: { conMtProfileId: consumers[i].id, recordStatus: "LATEST" },
      });
      let properties = await sequelize.models.properties.findOne({
        where: {
          [Op.and]: [{ key: "tier" }, { conMtProfileId: consumers[i].id }, { recordStatus: "LATEST" }],
        },
      });

      array.push({
        ...consumers[i],
        address,
        emergencyContact,
        properties,
      });
    }

    return array;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createProfile,
  getProfiles,
  getFullProfile,
  updateProfile,
  deleteProfile,
  addImages,
  getResponseWithoutPaggination,
  getAddressAndTiersAndEmergencyContact,
  checkConsumer,
};
// find date of Birth from age range
const dateOfBirth = async (ageFrom, ageTo) => {
  let year = new Date().getFullYear();
  if (ageFrom) {
    ageFrom = `${year - ageFrom}-01-01`;
  }
  if (ageTo) {
    ageTo = `${year - ageTo}-12-31`;
  }
  let data = { ageFrom, ageTo };
  return data;
};

const getConsumersByFacility = async (facility) => {
  try {
    let response = await sequelize.models.facility.findAll({
      where: {
        [Op.and]: [facility ? wherJSONId("facility", facility) : "", { recordStatus: "LATEST" }],
      },
      // group: ["id"],
    });
    // console.log(response)
    return response.map((consumer) => consumer.conMtProfileId);
  } catch (error) {
    throw error;
  }
};

const getConsumersByEstablishment = async (establishment) => {
  try {
    let response = await sequelize.models.establishment.findAll({
      where: {
        [Op.and]: [[establishment ? wherJSONId("establishment", establishment) : ""], { recordStatus: "LATEST" }],
      },
      // group: ["id"],
    });
    return response.map((consumer) => consumer.conMtProfileId);
  } catch (error) {
    throw error;
  }
};
// ================================================================= Full Profile support Funtions =============================================================

const getAddressForConsumer = async (id) => {
  // this function takes props consumer object without address and resturn consumer with address
  try {
    let address = await sequelize.models.address.findAll({
      where: { conMtProfileId: id, recordStatus: "LATEST" },
    });

    return address;
    // array.push({ ...consumers[i].dataValues, address });
  } catch (error) {
    throw error;
  }
};

const getEmergencyCotact = async (id) => {
  // this function takes props consumer object without EmergencyContact and resturn consumer with EmergencyContact
  try {
    let emergencyContact = await sequelize.models.emergencyContact.findAll({
      where: { conMtProfileId: id, recordStatus: "LATEST" },
    });

    return emergencyContact;
  } catch (error) {
    throw error;
  }
};

const getAttachments = async (id) => {
  // this function takes props consumer object without attachment and resturn consumer with attachment
  try {
    let attachments = await sequelize.models.attachments.findAll({
      where: { conMtProfileId: id, recordStatus: "LATEST" },
    });

    return attachments;
  } catch (error) {
    throw error;
  }
};

const getRelatedConsumer = async (id, res) => {
  // this function takes props consumer object without Related and resturn consumer related (from other, from him)
  try {
    // related From Himself
    let reltedFromHimSelf = await sequelize.models.relatedMembers.findAll({
      where: {
        [Op.and]: [wherJSONId("master", id), { recordStatus: "LATEST" }],
      },
    });
    // related from other
    let reltedFromOther = await sequelize.models.relatedMembers.findAll({
      where: {
        [Op.and]: [wherJSONId("sub", id), { recordStatus: "LATEST" }],
      },
    });
    //adress of related members
    if (reltedFromHimSelf) {
      for (let i = 0; i < reltedFromHimSelf.length; i++) {
        let reltedAddress = await sequelize.models.address.findAll({
          where: {
            conMtProfileId: reltedFromHimSelf[i].dataValues.sub.id,
            recordStatus: "LATEST",
          },
        });
        reltedFromHimSelf[i].dataValues.reltedAddress = reltedAddress;
      }
    }
    if (reltedFromHimSelf) {
      for (let i = 0; i < reltedFromHimSelf.length; i++) {
        let reltedEmergencyContact = await sequelize.models.emergencyContact.findAll({
          where: {
            conMtProfileId: reltedFromHimSelf[i].dataValues.sub.id,
            recordStatus: "LATEST",
          },
        });
        reltedFromHimSelf[i].dataValues.reltedEmergencyContact = reltedEmergencyContact;
      }
    }

    return { reltedFromHimSelf, reltedFromOther };
  } catch (error) {
    throw error;
  }
};

const getMedicalRecords = async (id, res) => {
  // this function takes props consumer object without Related and resturn consumer related (from other, from him)
  try {
    // midaical record based on type
    let response = [
      {
        id: "1",
        name: {
          ar: "حساسيه",
          en: "Allergies",
        },
        context: [],
      },
      {
        id: "2",
        name: {
          ar: "مزمنه امراض",
          en: " Chronic diseases",
        },
        context: [],
      },
      {
        id: "3",
        name: {
          ar: "سابفه عمليات",
          en: " Past surgeries",
        },
        context: [],
      },
      {
        id: "4",
        name: {
          ar: "مستخدمه ادويه",
          en: "Used medicines",
        },
        context: [],
      },
      {
        id: "5",
        name: {
          ar: "النتائج",
          en: "Results",
        },
        context: [],
      },
    ];
    let medicalRecord = await sequelize.models.medicalRecord.findAll({
      where: {
        [Op.and]: [wherJSONId("consumer", id), { recordStatus: "LATEST" }],
      },
    });
    if (!medicalRecord.length) return [];
    medicalRecord.forEach((element) => {
      element.recordType.id == 1
        ? response[0].context.push(element)
        : element.recordType.id == 2
        ? response[1].context.push(element)
        : element.recordType.id == 3
        ? response[2].context.push(element)
        : element.recordType.id == 4
        ? response[3].context.push(element)
        : response[4].context.push(element);
    });

    return response.map((record) => {
      if (record.context.length) {
        return record;
      }
    });
  } catch (error) {
    throw error;
  }
};

const getBasket = async (id) => {
  // this function takes props consumer object without Packages and resturn consumer with Package (every Package has # of services)
  try {
    let baskets = await sequelize.models.basket.findAll({
      where: { conMtProfileId: id, recordStatus: "LATEST" },
    });
    // now im going to find all services per Package
    for (let i = 0; i < baskets.length; i++) {
      let services = await sequelize.models.basketDetails.findAll({
        where: {
          conRtBasketId: baskets[i].dataValues.id,
          recordStatus: "LATEST",
        },
      });
      baskets[i].dataValues = { ...baskets[i].dataValues, services };
    }
    const packages = baskets.filter((ele) => ele?.itemType?.id == "1");
    const services = baskets.filter((ele) => ele?.itemType?.id == "3");
    const products = baskets.filter((ele) => ele?.itemType?.id == "2");

    return { packages, services, products };
  } catch (error) {
    throw error;
  }
};

const getBlackListHistoryFacility = async (id, facility) => {
  // this function take consumer and facility id and return the status of black list in facilty and the history record for black list
  try {
    let status;
    let result = await sequelize.models.blackList.findAndCountAll({
      where: {
        [Op.and]: [wherJSONId("blocker", facility), { conMtProfileId: { [Op.eq]: id } }],
      },
    });
    if (result.rows.length) {
      result.rows[result.rows.length - 1].action.name.en == "Block" ? (status = "The Consumer Now is Blocked at facility Level") : (status = "The Consumer does not Black list now");
    } else {
      status = "The Consumer does not Black list now";
    }

    // result.rows.length == '0'
    //   ? (status = "The Consumer does not Black list now")
    //   :  result.rows.length && result.rows[result.rows.length - 1].action.name.en == "Block"
    //   ? (status = "The Consumer Now is Blocked at facility Level")
    //   : (status = "The Consumer does not Black list now");
    //   console.log(result.rows.length == '0');
    //   console.log(result.rows.length && result.rows[result.rows.length - 1].action.name.en == "Block");
    //   console.log(status);
    //   console.log(result.rows[result.rows.length - 1].action.name.en);
    let BlackListFacilty = { status, ...result };
    return BlackListFacilty;
  } catch (error) {
    throw error;
  }
};

const getBlackListHistoryProvider = async (id) => {
  // this function take consumer a id and return the status of black list for any provider if made action for this consumer.
  try {
    let response = [];
    let result = await sequelize.models.blackList.findAll({
      attributes: [
        [sequelize.json("blocker.id"), "providerId"], // to access only on provider and return providerid
        [sequelize.fn("COUNT", sequelize.col("blocker")), "count"], // coount the number of record for every provider
      ],
      where: {
        [Op.and]: [wherJSONId("blocked_by", 2), { conMtProfileId: { [Op.eq]: id } }],
      },
      group: [sequelize.json("blocker.id")],
      // group by provider_id
    });
    // now i will give the records of counts
    for (let i = 0; i < result.length; i++) {
      let history = await sequelize.models.blackList.findAll({
        where: {
          [Op.and]: [wherJSONId("blocked_by", 2), { conMtProfileId: { [Op.eq]: id } }, wherJSONId("blocker", result[i].dataValues.providerId)],
        },
      });
      response.push({ history: history, status: result[i] });
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const getConsumerProperties = async (id, facility) => {
  // this functiom take consumer as props and return consumer with his/her properties like (tier,referedBy)
  try {
    let properties = await sequelize.models.properties.findAll({
      where: {
        [Op.and]: [wherJSONId("facility", facility), { conMtProfileId: id }, { recordStatus: "LATEST" }],
      },
    });
    // res.json(properties)
    return properties;
  } catch (error) {
    throw error;
  }
};

const getCalender = async (id) => {
  try {
    let calender = await sequelize.models.calender.findAll({
      where: {
        conMtProfileId: id,
        recordStatus: "LATEST",
      },
    });
    return calender;
  } catch (error) {
    throw error;
  }
};

const getFacilityDetails = async (id, facility) => {
  try {
    let facilityD = await sequelize.models.facility.findOne({
      where: {
        [Op.and]: [wherJSONId("facility", facility), { conMtProfileId: id }, { recordStatus: "LATEST" }],
      },
    });
    return facilityD;
  } catch (error) {
    throw error;
  }
};
function todayDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // add leading zero if month is less than 10
  const day = String(currentDate.getDate()).padStart(2, "0"); // add leading zero if day is less than 10
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
