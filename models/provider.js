'use strict';
const { Model, DATE } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Provider.init(
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
      provider:{type: DataTypes.JSON, allowNull: false},
      // THIS INFORMATION TO HEADER
      transactionId: { type: DataTypes.STRING, allowNull: false },
      recordStatus: {
        type: DataTypes.ENUM,
        values: ['LATEST', 'UPDATED', 'DELETED'],
        defaultValue: 'LATEST',
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
      //   hooks: {
      //     afterCreate: saveDocument,
      //     afterUpdate: updateDocument,
      //   },
      sequelize,
      modelName: 'Provider',
      tableName: 'CON_RT_Provider',
      underscored: true,
      freezeTableName: true,
    }
  );
  return Provider;
};
