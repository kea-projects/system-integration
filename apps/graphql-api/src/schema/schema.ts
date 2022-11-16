import Product from "../models/Product";
import ProductAdditionalInfo from "../models/ProductAdditionalInfo";
import ProductImage from "../models/ProductImage";
import ProductType from "./types/ProductType";
import ProductAdditionalInfoType from "./types/ProductAdditionalInfoType";
import ProductImageType from "./types/ProductImageType";

import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLSchema,
} from "graphql";

import mutation from "./mutations";

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // PRODUCT
        Products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find();
            },
        },
        Product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Product.findById(args.id);
            },
        },
        // PRODUCT ADDITIONAL INFO
        ProductAdditionalInfos: {
            type: new GraphQLList(ProductAdditionalInfoType),
            resolve(parent, args) {
                return ProductAdditionalInfo.find();
            },
        },
        ProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ProductAdditionalInfo.findById(args.id);
            },
        },
        // PRODUCT IMAGES
        ProductImages: {
            type: new GraphQLList(ProductImageType),
            resolve(parent, args) {
                return ProductImage.find();
            },
        },
        ProductImage: {
            type: ProductImageType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ProductImage.findById(args.id);
            },
        },
    },
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation,
})