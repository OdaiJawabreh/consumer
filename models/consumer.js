"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class consumer extends Model {
    static associate(models) {}
  }
  consumer.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.JSON, allowNull: false },
      middleName: { type: DataTypes.JSON },
      lastName: { type: DataTypes.JSON, allowNull: false },
      image: DataTypes.STRING,
      dob: DataTypes.STRING,
      gender: { type: DataTypes.JSON },
      martialStatus: { type: DataTypes.JSON },
      nationality: { type: DataTypes.JSON },
      occupation: { type: DataTypes.JSON },
      identification: { type: DataTypes.JSON },
      status: {
        type: DataTypes.ENUM,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
      },
      primaryPhone: { type: DataTypes.JSON, allowNull: false },
      seconderyPhone: DataTypes.JSON,
      bloodType: DataTypes.JSON,
      email: { type: DataTypes.STRING, isEmail: true },
      website: DataTypes.STRING,
      socialMedia: DataTypes.JSON,
      dependent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      cimMtUserId: DataTypes.STRING,
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
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
      modelName: "consumer",
      tableName: "CON_MT_Profile",
      underscored: true,
      freezeTableName: true,
    }
  );
  return consumer;
};
