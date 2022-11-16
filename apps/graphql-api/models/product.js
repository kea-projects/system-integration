'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    product_name: DataTypes.STRING,
    product_sub_title: DataTypes.STRING,
    product_description: DataTypes.STRING,
    main_category: DataTypes.STRING,
    sub_category: DataTypes.STRING,
    price: DataTypes.NUMBER,
    link: DataTypes.STRING,
    overall_rating: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};