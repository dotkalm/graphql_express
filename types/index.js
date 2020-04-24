const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull 
} = graphql;

const myLocations = new graphql.GraphQLObjectType({
    name: 'location',
    fields: () => {
        return{
            name:{
                type: graphql.GraphQLString
            },
            id: {
                type: graphql.GraphQLInt
            },
            day: {
                type: GraphQLString,
            },
            time: {
                type: GraphQLString,
            },
            lat: {
                type: graphql.GraphQLFloat
            },
            geohash: {
                type: GraphQLString
            },
            long: {
                type: graphql.GraphQLFloat
            }
        }
    }
})

const kidsBirthdays = new graphql.GraphQLObjectType({
    name: 'birth',
    fields: () => {
        return{
            birthday:{
                type: graphql.GraphQLString
            },
            name:{
                type: graphql.GraphQLString
            },
            time:{
                type: graphql.GraphQLString
            }
        }
    }
})

const userInfo = new graphql.GraphQLObjectType({
    name: 'user',
    fields: () => {
        return{
            username:{
                type: graphql.GraphQLString
            },
            hashedPassword:{
                type: graphql.GraphQLString
            } 
        }
    }
})

module.exports = { myLocations, kidsBirthdays, userInfo }
