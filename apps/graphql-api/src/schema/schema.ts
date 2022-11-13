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
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLSchema,
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

// MUTATIONS
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // Add new user
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            resolve(parent, args) {
                const user = new User({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });

                return user.save();
            },
        },

        // Delete user
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                User.find({ userId: args.id }).then((users) => {
                    users.forEach((user) => {
                        user.remove();
                    });
                });

                return User.findByIdAndRemove(args.id);
            },
        },

        // Create invite
        createInvite: {
            type: InviteType,
            args: {
                invitee_id: { type: GraphQLNonNull(GraphQLID) },
                invited_email: { type: GraphQLNonNull(GraphQLString) },
                // token: { type: GraphQLNonNull(GraphQLString) },
                // expiration: { type: GraphQLString },
            },
            resolve(parent, args) {
                const invite = new Invite({
                    invitee_id: args.invitee_id,
                    invited_email: args.invited_email,
                    // token: args.token,
                    // expiration: args.expiration,
                })

                return invite.save();
            },
        },

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
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation,
})