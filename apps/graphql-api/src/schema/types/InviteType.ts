import User from "../../data/User";
import UserType from "./UserType";
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from "graphql";

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

export default InviteType;