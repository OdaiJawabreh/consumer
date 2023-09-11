"use strict";

const saveDocument = async (data, options) => {
  await es.insertOrUpdate("consumers", [data]);
};
const updateDocument = async (data, options) => {
  await es.insertOrUpdate("consumers", [data]);
};
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  address.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },


      // THIS INFORMATION TO HEADER
      conMtProfileId: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.JSON},
      city: DataTypes.JSON,
      area: DataTypes.JSON,
      landmark:DataTypes.JSON,
      street:DataTypes.JSON,
      building:DataTypes.JSON,
      primary:{ type: DataTypes.BOOLEAN, defaultValue: false },
     

      // THIS INFORMATION TO HEADER
      transactionId: { type: DataTypes.STRING, allowNull: false },
      recordStatus: {
        type: DataTypes.ENUM,
        values: ["LATEST", "UPDATED", "DELETED"],
        defaultValue: "LATEST",
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
       createdBy: {
        type: DataTypes.JSON,
      },
    },

    {
      initialAutoIncrement: 1000000,
      // hooks: {
      //   afterCreate: saveDocument,
      //   afterUpdate: updateDocument,
      // },
      sequelize,
      modelName: "address",
      tableName: "CON_RT_Address",
      underscored: true,
      freezeTableName: true,
    }
  );
  return address;
};
