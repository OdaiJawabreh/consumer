"use strict";

const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  basket.init(
    {
      seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id: { type: DataTypes.STRING, allowNull: false },

      conMtProfileId: { type: DataTypes.STRING, allowNull: false },
      billId: { type: DataTypes.JSON},
      itemType: { type: DataTypes.JSON },
      item: { type: DataTypes.JSON },
      buyingDate: DataTypes.STRING,
      expiaryDate: DataTypes.STRING,
      usedDate: { type: DataTypes.STRING },
      status:  { type: DataTypes.JSON },
      facility: { type: DataTypes.JSON },
      amount: { type: DataTypes.JSON },
      billId: {type: DataTypes.STRING  },
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
      modelName: "basket",
      tableName: "CON_RT_Basket",
      underscored: true,
      freezeTableName: true,
    }
  );
  return basket;
};
