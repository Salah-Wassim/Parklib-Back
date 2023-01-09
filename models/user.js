'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.ParkingParticulier, {
        foreignKey: 'fk_user_id',
        constraints: false
      })
      User.hasMany(models.Booking, {
        foreignKey: 'fk_tenant_id',
        constraints: true
      })
      User.hasMany(models.Booking, {
        foreignKey: 'fk_owner_id',
        constraints: true
      })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    picture: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActivated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
