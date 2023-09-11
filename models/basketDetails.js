"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class basketDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  basketDetails.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },

      conRtBasketId: { type: DataTypes.STRING, allowNull: false },
      item: { type: DataTypes.JSON },
      status: DataTypes.JSON,
      usedDate: { type: DataTypes.STRING },
      notes: DataTypes.JSON,
      price: DataTypes.JSON,

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
      modelName: "basketDetails",
      tableName: "CON_RT_Basket_Details",
      underscored: true,
      freezeTableName: true,
    }
  );
  return basketDetails;
};
