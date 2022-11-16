//import Invite from "../data/Invite";
import Product from "../data/Product";
//import User from "../data/User";
import ProductAdditionalInfo from "../data/ProductAdditionalInfo";
import ProductImage from "../data/ProductImage";
import ProductType from "./types/ProductType";
//import InviteType from "./types/InviteType";
import ProductAdditionalInfoType from "./types/ProductAdditionalInfoType";
import ProductImageType from "./types/ProductImageType";
//import UserType from "./types/UserType";

import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLInt,
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
        // // INVITE
        // Invites: {
        //     type: new GraphQLList(InviteType),
        //     resolve(parent, args) {
        //         return Invite.find();
        //     },
        // },
        // Invite: {
        //     type: InviteType,
        //     args: { id: { type: GraphQLID } },
        //     resolve(parent, args) {
        //         return Invite.findById(args.id);
        //     },
        // },
        // // USERS
        // Users: {
        //     type: new GraphQLList(UserType),
        //     resolve(parent, args) {
        //         return User.find();
        //     },
        // },
        // User: {
        //     type: UserType,
        //     args: { id: { type: GraphQLID } },
        //     resolve(parent, args) {
        //         return User.findById(args.id);
        //     },
        // },
    },
});

// MUTATIONS
const mutation = new GraphQLObjectType({
    name: "Mutation",
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

        // // Add new user
        // addUser: {
        //     type: UserType,
        //     args: {
        //         name: { type: GraphQLString },
        //         email: { type: GraphQLString },
        //         phone: { type: GraphQLString },
        //     },
        //     resolve(parent, args) {
        //         const user = new User({
        //             name: args.name,
        //             email: args.email,
        //             phone: args.phone,
        //         });

        //         return user.save();
        //     },
        // },

        // // Delete user
        // deleteUser: {
        //     type: UserType,
        //     args: {
        //         id: { type: GraphQLNonNull(GraphQLID) },
        //     },
        //     resolve(parent, args) {
        //         User.find({ userId: args.id }).then((users) => {
        //             users.forEach((user) => {
        //                 user.remove();
        //             });
        //         });

        //         return User.findByIdAndRemove(args.id);
        //     },
        // },

        // // Create invite
        // createInvite: {
        //     type: InviteType,
        //     args: {
        //         invitee_id: { type: GraphQLNonNull(GraphQLID) },
        //         invited_email: { type: GraphQLNonNull(GraphQLString) },
        //         // token: { type: GraphQLNonNull(GraphQLString) },
        //         // expiration: { type: GraphQLString },
        //     },
        //     resolve(parent, args) {
        //         const invite = new Invite({
        //             invitee_id: args.invitee_id,
        //             invited_email: args.invited_email,
        //             // token: args.token,
        //             // expiration: args.expiration,
        //         })

        //         return invite.save();
        //     },
        // },

    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation,
})