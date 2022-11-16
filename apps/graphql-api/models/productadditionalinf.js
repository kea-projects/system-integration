'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAdditionalInf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductAdditionalInf.init({
    product_id: DataTypes.STRING,
    image_url: DataTypes.STRING,
    alt_text: DataTypes.STRING,
    additional_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductAdditionalInf',
  });
  return ProductAdditionalInf;
};