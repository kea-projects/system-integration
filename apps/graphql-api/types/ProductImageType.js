import Product from "../../models/Product.js";
import ProductType from "./ProductType.js";
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from "graphql";

const ProductImageType = new GraphQLObjectType({
    name: "ProductImage",
    fields: () => ({
        product_image_id: { type: GraphQLID },
        product_id: { 
            type: ProductType,
            resolve(parent, args) {
                return Product.findById(parent.product_id)
            }
        },
        image_url: { type: GraphQLString },
        alt_text: { type: GraphQLString },
        additional_info: { type: GraphQLString },
    }),
});

export default ProductImageType;