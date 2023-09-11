// this page to define all Apis in feature
const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");
const res = require("express/lib/response");

const createProfileApi = async (consumerDTO) => {
  try {
    return await sequelize.models.consumer.create(consumerDTO);
  } catch (error) {
    throw error;
  }
};
const createMedicalRecord = async (medicalDTO) => {
  try {
    return await sequelize.models.medicalRecord.create(medicalDTO);
  } catch (error) {
    throw error;
  }
};
const createBasket = async (basketDTO) => {
  try {
    return await sequelize.models.basket.create(basketDTO);
  } catch (error) {
    throw error;
  }
};
const createBasketDetails = async (basketDTO) => {
  try {
    return await sequelize.models.basketDetails.create(basketDTO);
  } catch (error) {
    throw error;
  }
};

const addAddressToProfile = async (consumerAddressDTO) => {
  try {
    return await sequelize.models.address.create(consumerAddressDTO);
  } catch (error) {
    throw error;
  }
};

const addConsumerToFacility = async (consumerFacilityDTO) => {
  try {
    return await sequelize.models.facility.create(consumerFacilityDTO);
  } catch (error) {
    throw error;
  }
};

const addConsumerToEstablishment = async (consumerEstablishmentDTO) => {
  try {
    return await sequelize.models.establishment.create(
      consumerEstablishmentDTO
    );
  } catch (error) {
    throw error;
  }
};

const emergencyContactToConsumer = async (consumerEmergenctContactDTO) => {
  try {
    return await sequelize.models.emergencyContact.create(
      consumerEmergenctContactDTO
    );
  } catch (error) {
    throw error;
  }
};
const AttachmentsToConsumer = async (consumerAttachmentDTO) => {
  try {
    return await sequelize.models.attachments.create(consumerAttachmentDTO);
  } catch (error) {
    throw error;
  }
};

const relatedConsumer = async (relatedDTO) => {
  try {
    return await sequelize.models.relatedMembers.create(relatedDTO);
  } catch (error) {
    throw error;
  }
};

const PreferencesCreate = async (preferenceDTO) => {
  // THIS create wil Work for 4 cases add and reomve from Black list for two levele facility level and provider
  try {
    return await sequelize.models.preferences.create(preferenceDTO);
  } catch (error) {
    throw error;
  }
};
const BlackListAction = async (blackListDTO) => {
  // THIS create wil Work for 4 cases add and reomve from Black list for two levele facility level and provider
  try {
    return await sequelize.models.blackList.create(blackListDTO);
  } catch (error) {
    throw error;
  }
};

const calenderConsumer = async (calenderDTO) => {
  // THIS will add events in consumer Calender like appointment tasl etc...
  try {
    return await sequelize.models.calender.create(calenderDTO);
  } catch (error) {
    throw error;
  }
};

const propertiesConsumer = async (propertiesDTO) => {
  // THIS will add proarities to spacific consumer
  try {
    return await sequelize.models.properties.create(propertiesDTO);
  } catch (error) {
    throw error;
  }
};
const consumerSettings = async (consumerSettingsDTO) => {
  // THIS will add Settings to consumer feature
  try {
    return await sequelize.models.setting.create(consumerSettingsDTO);
  } catch (error) {
    throw error;
  }
};

const updateRecordStatus = async (condition, modelName, action) => {
  try {
    // this function will update RecordStatus from latest to updated in all models ander any condition
    let response = await sequelize.models[modelName].update(
      { recordStatus: action },
      {
        where: condition,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const findEntity = async (condition, modelName) => {
  try {
    // this function will update RecordStatus from latest to updated in all models ander any condition
    let response = await sequelize.models[modelName].findOne({
      where: condition,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
const createSegmentApi = async (segmentDTO) => {
  try {
    return await sequelize.models.segment.create(segmentDTO);
  } catch (error) {
    // console.log("error in api call", error);
    throw error;
  }
};
const createCriteriaApi = async (criteriaDTO) => {
  try {
    return await sequelize.models.segmentCriteria.create(criteriaDTO);
  } catch (error) {
    // console.log("error in api call", error);
    throw error;
  }
};
module.exports = {
  createProfileApi,
  addAddressToProfile,
  addConsumerToFacility,
  addConsumerToEstablishment,
  emergencyContactToConsumer,
  AttachmentsToConsumer,
  relatedConsumer,
  // PackageConsumer,
  // addServicesPackage,
  BlackListAction,
  calenderConsumer,
  propertiesConsumer,
  consumerSettings,
  updateRecordStatus,
  findEntity,
  createMedicalRecord,
  PreferencesCreate,
  createSegmentApi,
  createCriteriaApi,
  createBasket,
  createBasketDetails
};
