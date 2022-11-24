import graphql from 'graphql';
import { database } from './databaseSetup.js';


const ProductType = new graphql.GraphQLObjectType({
    name: "Product",
    fields: () => ({
        product_id: { type: graphql.GraphQLID },
        product_name: { type: graphql.GraphQLString },
        product_sub_title: { type: graphql.GraphQLString },
        product_description: { type: graphql.GraphQLString },
        main_category: { type: graphql.GraphQLString },
        sub_category: { type: graphql.GraphQLString },
        price: { type: graphql.GraphQLInt },
        link: { type: graphql.GraphQLString },
        overall_rating: { type: graphql.GraphQLString },
    }),
});

const ProductImageType = new graphql.GraphQLObjectType({
    name: "ProductImage",
    fields: () => ({
        product_image_id: { type: graphql.GraphQLID },
        product_id: { type: graphql.GraphQLInt },
        image_url: { type: graphql.GraphQLString },
        alt_text: { type: graphql.GraphQLString },
        additional_info: { type: graphql.GraphQLString },
    }),
});

const ProductAdditionalInfoType = new graphql.GraphQLObjectType({
    name: "ProductAdditionalInfo",
    fields: () => ({
        product_additional_info_id: { type: graphql.GraphQLID },
        product_id: { type: graphql.GraphQLInt },
        choices: { type: graphql.GraphQLString },
        additional_info: { type: graphql.GraphQLString },
    }),
});

const queryType = new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
        // PRODUCT
        Products: {
            type: new graphql.GraphQLList(ProductType),
            resolve: (root, args, context, info) => {
                return new Promise( async (resolve, reject) => {
                    const results = await database.all("SELECT * FROM Products;");
                    resolve(results);
                });
            },
        },
        Product: {
            type: ProductType,
            args: { 
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                },
            },
            resolve: (root, args, context, info) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.get("SELECT * FROM Products WHERE id = ?;",[args.id]);
                    resolve(result);
                });
            },
        },

        // PRODUCT ADDITIONAL INFO
        ProductAdditionalInfos: {
            type: new graphql.GraphQLList(ProductAdditionalInfoType),
            resolve: (root, args, context, info) => {
                return new Promise(async (resolve, reject) => {
                    const result = await database.all("SELECT * FROM ProductAdditionalInfos;");
                    resolve(result);
                });
            },
        },
        ProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: { 
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                },
            },
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {
                
                    database.all("SELECT * FROM ProductAdditionalInfos WHERE id = (?);",[args.id]);
                    resolve(result);
                });
            },
        },

        // PRODUCT IMAGES
        ProductImages: {
            type: new graphql.GraphQLList(ProductImageType),
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {
                    database.all("SELECT * FROM ProductImages;",);
                    resolve(result);
                });
            },
        },
        ProductImage: {
            type: ProductImageType,
            args: { 
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                },
            },
            resolve: (root, args, context, info) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.all("SELECT * FROM ProductImages WHERE id = (?);",[args.id]);
                    resolve(result);
                })
            },
        },
    },
});

const mutationType = new graphql.GraphQLObjectType({
    name: "mutation",
    fields: {
        // add product additional info
        createProduct: {
            type: ProductType,
            args: {
                product_name: { type: graphql.GraphQLString },
                product_sub_title: { type: graphql.GraphQLString },
                product_description: { type: graphql.GraphQLString },
                main_category: { type: graphql.GraphQLString },
                sub_category: { type: graphql.GraphQLString },
                price: { type: graphql.GraphQLInt },
                link: { type: graphql.GraphQLString },
                overall_rating: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('INSERT INTO Products (product_name, product_name, product_sub_title, product_description, main_category, sub_category, price, link, overall_rating) VALUES (?,?,?,?,?,?,?,?,?);', [args.product_name, args.product_name, args.product_sub_title, args.product_description, args.main_category, args.sub_category, args.price, args.link, args.overall_rating]);
                    resolve(result);
                });
            },
        },

        // Update product
        updateProduct: {
            type: ProductType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
                product_name: { type: graphql.GraphQLString },
                product_sub_title: { type: graphql.GraphQLString },
                product_description: { type: graphql.GraphQLString },
                main_category: { type: graphql.GraphQLString },
                sub_category: { type: graphql.GraphQLString },
                price: { type: graphql.GraphQLInt },
                link: { type: graphql.GraphQLString },
                overall_rating: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run(`UPDATE Products SET product_name = (?), product_sub_title = (?), product_description = (?), main_category = (?), sub_category = (?), price = (?), link = (?), overall_rating = (?) WHERE id = (?);`, [args.product_name, args.product_name, args.product_sub_title, args.product_description, args.main_category, args.sub_category, args.price, args.link, args.overall_rating, args.id]);
                    resolve(result);
                });
            },
        },

        // delete product
        deleteProduct: {
            type: ProductType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
            },
            resolve(parent, args) {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('DELETE from Products WHERE id =(?);', [args.id]);
                    resolve(result);
                });
            },
        },

        // add product additional info
        createProductImage: {
            type: ProductImageType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
                product_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
                image_url: { type: graphql.GraphQLString },
                alt_text: { type: graphql.GraphQLString },
                additional_info: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('INSERT INTO ProductImages (product_id, image_url, alt_text, additional_info) VALUES (?,?,?,?);', [args.product_id, args.image_url, args.alt_text, args.additional_info]);
                    resolve(result);
                })
            },
        },

        updateProductImage: {
            type: ProductImageType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
                product_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
                image_url: { type: graphql.GraphQLString },
                alt_text: { type: graphql.GraphQLString },
                additional_info: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run(`UPDATE ProductImages SET product_id = (?), image_url = (?), alt_text = (?), additional_info = (?) WHERE id = (?);`, [args.product_id, args.image_url, args.alt_text, args.additional_info, args.id]);
                    resolve(result);
                });
            },
        },

        // delete product image
        deleteProductImage: {
            type: ProductImageType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
            },
            resolve(parent, args) {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('DELETE from ProductImages WHERE product_image_id =(?);', [args.id]);
                    resolve(result);
                });
            },
        },

        // add product additional info
        addProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
                product_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
                choices: { type: graphql.GraphQLID },
                additional_info: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('INSERT INTO ProductAdditionalInfos (product_id, choices, additional_info) VALUES (?,?,?);', [args.product_id, args.choices, args.additional_info]);
                    resolve(result);
                })
            },
        },

        updateProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
                product_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
                choices: { type: graphql.GraphQLString },
                additional_info: { type: graphql.GraphQLString },
            },
            resolve: (root, args) => {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run(`UPDATE ProductAdditionalInfo SET product_id = (?), choices = (?), additional_info = (?) WHERE product_image_id = (?);`, [args.product_id, args.choices, args.additional_info, args.id]);
                    resolve(result);
                });
            },
        },

        // delete product additional info
        deleteProductAdditionalInfo: {
            type: ProductAdditionalInfoType,
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
            },
            resolve(parent, args) {
                return new Promise( async (resolve, reject) => {
                    const result = await database.run('DELETE from ProductAdditionalInfo WHERE id =(?);', [args.id]);
                    resolve(result);
                });
            },
        },
    },
});

//define schema with post object, queries, and mutation 
export const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType 
});

   