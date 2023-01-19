'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User);
      Booking.hasOne(models.Post);
    }
  }
  Booking.init({
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    isValidated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};