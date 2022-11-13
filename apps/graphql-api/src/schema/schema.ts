import Invite from "../data/Invite";
import Product from "../data/Product";
import User from "../data/User";
import ProductAdditionalInfo from "../data/ProductAdditionalInfo";
import ProductImage from "../data/ProductImage";
import ProductType from "./types/ProductType";
import InviteType from "./types/InviteType";
import ProductAdditionalInfoType from "./types/ProductAdditionalInfoType";
import ProductImageType from "./types/ProductImageType";
import UserType from "./types/UserType";

import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList
} from "graphql";

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