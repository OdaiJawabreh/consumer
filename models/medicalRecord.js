"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medicalRecord.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },
      consumer: { type: DataTypes.JSON, allowNull: false },
      provider: { type: DataTypes.JSON },
      recordType: { type: DataTypes.JSON, allowNull: false },
      dateFrom: { type: DataTypes.STRING },
      dateTo: { type: DataTypes.STRING },
      subject: { type: DataTypes.JSON, allowNull: false },
      description: { type: DataTypes.JSON},
      attachments: { type: DataTypes.JSON},
      medicine: { type: DataTypes.JSON},    
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
      modelName: "medicalRecord",
      tableName: "CON_RT_Medical_Record",
      underscored: true,
      freezeTableName: true,
    }
  );
  return medicalRecord;
};
