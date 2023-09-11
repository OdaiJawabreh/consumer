"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class segment extends Model {
 
    static associate(models) {
     }
  }
  segment.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },


      // THIS INFORMATION TO HEADER
      name:{ type: DataTypes.JSON, allowNull: false},
      code:{ type: DataTypes.STRING, allowNull: false},
      type:{ type: DataTypes.JSON, allowNull: false},
      importData: { type: DataTypes.JSON},
      createdDate: { type: DataTypes.STRING, allowNull: false},
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
      modelName: "segment",
      tableName: "CON_MT_Segment",
      underscored: true,
      freezeTableName: true,
    }
  );
  return segment;
};
