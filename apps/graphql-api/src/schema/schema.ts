import Invite from "../data/Invite";
import Product from "../data/Product";
import User from "../data/User";
import ProductAdditionalInfo from "../data/ProductAdditionalInfo";
import ProductImage from "../data/ProductImage";

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} from "graphql";

// INVITE
const InviteType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        invitee_id: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.invitee_id)
            }
        },
        invited_email: { type: GraphQLString },
        // token: { type: GraphQLString },
        // expiration: { type: GraphQLString },
    }),
});

// PRODUCT 
const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: GraphQLID },
        product_name: { type: GraphQLString },
        product_sub_title: { type: GraphQLString },
        product_description: { type: GraphQLString },
        main_category: { type: GraphQLString },
        sub_category: { type: GraphQLString },
        price: { type: GraphQLInt },
        link: { type: GraphQLString },
        overall_rating: { type: GraphQLString },
    }),
});

// PRODUCT ADDITIONAL INFO
const ProductAdditionalInfoType = new GraphQLObjectType({
    name: "ProductAdditionalInfo",
    fields: () => ({
        id: { type: GraphQLID },
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

// PRODUCT ADDITIONAL INFO
const ProductImageType = new GraphQLObjectType({
    name: "ProductImage",
    fields: () => ({
        id: { type: GraphQLID },
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

// USER 
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

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
        // INVITE
        Invites: {
            type: new GraphQLList(InviteType),
            resolve(parent, args) {
                return Invite.find();
            },
        },
        Invite: {
            type: InviteType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Invite.findById(args.id);
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
        // USERS
        Users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            },
        },
        User: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            },
        },
    },
  });