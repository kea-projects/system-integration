import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
} from "graphql";

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        product_id: { type: GraphQLID },
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

export default ProductType;