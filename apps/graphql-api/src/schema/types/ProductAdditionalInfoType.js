import Product from "../../models/Product.js";
import ProductType from "./ProductType.js";
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from "graphql";

const ProductAdditionalInfoType = new GraphQLObjectType({
    name: "ProductAdditionalInfo",
    fields: () => ({
        product_additional_info_id: { type: GraphQLID },
        product_id: { 
            type: ProductType,
            resolve(parent, args) {
                return Product.findById(parent.product_id)
            }
        },
        choices: { type: GraphQLString },
        additional_info: { type: GraphQLString },
    }),
});

export default ProductAdditionalInfoType;