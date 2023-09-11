"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  setting.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },

      // THIS INFORMATION TO HEADER
      tier: { type: DataTypes.JSON },
      attachmentType: { type: DataTypes.JSON },
      availability: DataTypes.JSON,
      blockAction:{ type: DataTypes.JSON },
      referredBy: DataTypes.JSON,
      blockBy: DataTypes.JSON,
      blockRequester: DataTypes.JSON,
      recordType: DataTypes.JSON,
      segmentType: DataTypes.JSON,
      filterCratiria: DataTypes.JSON,
      itemType:DataTypes.JSON,
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
      modelName: "setting",
      tableName: "CON_ST_Settings",
      underscored: true,
      freezeTableName: true,
    }
  );
  return setting;
};
