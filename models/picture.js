'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Picture.belongsTo(models.Post);
    }
  };
  Picture.init({
    url: DataTypes.STRING,
    postid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
  },
  }, {
    sequelize,
    modelName: 'Picture',
  });
  return Picture;
};