"use strict";

const saveDocument = async (data, options) => {
  await es.insertOrUpdate("consumers", [data]);
};
const updateDocument = async (data, options) => {
  await es.insertOrUpdate("consumers", [data]);
};
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class attachments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  attachments.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },
      conMtProfileId: DataTypes.STRING,
      type: { type: DataTypes.JSON },
      image: { type: DataTypes.STRING },
      description: { type: DataTypes.JSON },
      date: { type: DataTypes.STRING },
      facility: { type: DataTypes.JSON },

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
      modelName: "attachments",
      tableName: "CON_RT_Attachments",
      underscored: true,
      freezeTableName: true,
    }
  );
  return attachments;
};
