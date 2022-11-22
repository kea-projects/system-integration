import Product from "../models/Product.js";
import ProductAdditionalInfo from "../models/ProductAdditionalInfo.js";
import ProductImage from "../models/ProductImage.js";
import ProductType from "./types/ProductType.js";
import ProductAdditionalInfoType from "./types/ProductAdditionalInfoType.js";
import ProductImageType from "./types/ProductImageType.js";

import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
} from "graphql";

// MUTATIONS
const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        // add product additional info
        addProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                product_id: { type: GraphQLNonNull(GraphQLID) },
                choices: { type: GraphQLNonNull(GraphQLID) },
                additional_info: { type: GraphQLString },
            },
            resolve(parent, args) {
                const productAdditionalInfo = new ProductAdditionalInfo({
                    product_id: args.product_id,
                    choices: args.choices,
                    additional_info: args.additional_info,
                });

                return productAdditionalInfo.save();
            },
        },

        updateProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                product_id: { type: GraphQLNonNull(GraphQLID) },
                choices: { type: GraphQLNonNull(GraphQLID) },
                additional_info: { type: GraphQLString },
            },
            resolve(parent, args) {
                return ProductAdditionalInfo.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            product_id: args.product_id,
                            choices: args.choices,
                            additional_info: args.additional_info,
                        },
                    },
                    { new: true },
                );
            },
        },

        // delete product additional info
        deleteProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return ProductAdditionalInfo.findByIdAndRemove(args.id);
            },
        },

        // add product additional info
        addProductImage: {
            type: ProductImageType,
            args: {
                product_id: { type: GraphQLNonNull(GraphQLID) },
                image_url: { type: GraphQLNonNull(GraphQLID) },
                alt_text: { type: GraphQLString },
                additional_info: { type: GraphQLString },
            },
            resolve(parent, args) {
                const productImage = new ProductImage({
                    product_id: args.product_id,
                    image_url: args.image_url,
                    alt_text: args.alt_text,
                    additional_info: args.additional_info,
                });

                return productImage.save();
            },
        },

        updateProductImage: {
            type: ProductImageType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                product_id: { type: GraphQLNonNull(GraphQLID) },
                image_url: { type: GraphQLNonNull(GraphQLID) },
                alt_text: { type: GraphQLString },
                additional_info: { type: GraphQLString },
            },
            resolve(parent, args) {
                return ProductImage.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            product_id: args.product_id,
                            image_url: args.image_url,
                            alt_text: args.alt_text,
                            additional_info: args.additional_info,
                        },
                    },
                    { new: true },
                );
            },
        },

        // delete product image
        deleteProductImage: {
            type: ProductImageType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return ProductImage.findByIdAndRemove(args.id);
            },
        },

        updateProduct: {
            type: ProductType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                product_id: { type: GraphQLNonNull(GraphQLID) },
                product_name: { type: GraphQLString },
                product_sub_title: { type: GraphQLString },
                product_description: { type: GraphQLString },
                main_category: { type: GraphQLString },
                sub_category: { type: GraphQLString },
                price: { type: GraphQLInt },
                link: { type: GraphQLString },
                overall_rating: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Product.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            product_id: args.product_id,
                            product_name: args.product_name,
                            product_sub_title: args.product_sub_title,
                            product_description: args.product_description,
                            main_category: args.main_category,
                            sub_category: args.sub_category,
                            price: args.price,
                            link: args.link,
                            overall_rating: args.overall_rating,
                        },
                    },
                    { new: true },
                );
            },
        },

         // add product additional info
         addProduct: {
            type: ProductType,
            args: {
                product_id: { type: GraphQLNonNull(GraphQLID) },
                product_name: { type: GraphQLString },
                product_sub_title: { type: GraphQLString },
                product_description: { type: GraphQLString },
                main_category: { type: GraphQLString },
                sub_category: { type: GraphQLString },
                price: { type: GraphQLInt },
                link: { type: GraphQLString },
                overall_rating: { type: GraphQLString },
            },
            resolve(parent, args) {
                const product = new Product({
                    product_id: args.product_id,
                    product_name: args.product_name,
                    product_sub_title: args.product_sub_title,
                    product_description: args.product_description,
                    main_category: args.main_category,
                    sub_category: args.sub_category,
                    price: args.price,
                    link: args.link,
                    overall_rating: args.overall_rating,
                });

                return product.save();
            },
        },

        // delete product
        deleteProduct: {
            type: ProductType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Product.findByIdAndRemove(args.id);
            },
        },
    }
});

export default mutation;