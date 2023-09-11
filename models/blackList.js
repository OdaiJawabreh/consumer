"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blackList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blackList.init(
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
      blockedBy: { type: DataTypes.JSON },
      blocker: DataTypes.JSON,
      action: DataTypes.JSON,
      reason: { type: DataTypes.JSON },
      requestedBy: DataTypes.JSON,
      requester: DataTypes.JSON,
      date: { type: DataTypes.STRING },
      notes: DataTypes.JSON,
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
      modelName: "blackList",
      tableName: "CON_TT_Block_History",
      underscored: true,
      freezeTableName: true,
    }
  );
  return blackList;
};
