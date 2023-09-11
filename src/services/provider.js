const { sequelize } = require("../../models/index");
const res = require("express/lib/response");

 const addProvidersToConsumers = async (ProviderDTO) => {
    try {
      return await sequelize.models.Provider.create(ProviderDTO);
    } catch (error) {
      throw error;
    }
  };
  module.exports = { addProvidersToConsumers }