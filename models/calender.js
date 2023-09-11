"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class calender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  calender.init(
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
      provider: DataTypes.JSON,
      services: DataTypes.JSON,
      description: { type: DataTypes.JSON},
      type: DataTypes.JSON,
      status: DataTypes.JSON,
      reference: DataTypes.STRING,
      date:DataTypes.STRING,
      timeFrom:DataTypes.STRING,
      timeTo:DataTypes.STRING,
      dateFrom:DataTypes.STRING,
      dateTo:DataTypes.STRING,
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
      modelName: "calender",
      tableName: "CON_TT_Calendar",
      underscored: true,
      freezeTableName: true,
    }
  );
  return calender;
};
