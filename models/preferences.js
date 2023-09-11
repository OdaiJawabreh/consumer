"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class preferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  preferences.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },
      group: {
        type: DataTypes.ENUM,
        values: ["GENERAL","SPECIFIC"],
        allowNull: false,
      },
      key: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.BOOLEAN, allowNull: false },
      description: { type: DataTypes.JSON},
      startDate: DataTypes.STRING,     
      endDate: DataTypes.STRING,     
      startTime: DataTypes.STRING,     
      endTime: DataTypes.STRING,     
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
      modelName: "preferences",
      tableName: "CON_ST_Preferences",
      underscored: true,
      freezeTableName: true,
    }
  );
  return preferences;
};
