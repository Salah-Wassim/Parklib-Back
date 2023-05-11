'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.ParkingParticulier);
      Post.hasOne(models.Booking);
      Post.hasMany(models.Picture);
      Post.belongsTo(models.ValidationStatus);
      Post.belongsTo(models.User)
    }
  };
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    typeOfPlace : DataTypes.STRING,
    contact: DataTypes.STRING,
    isAssured: DataTypes.BOOLEAN,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};