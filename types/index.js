const graphql = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date')
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull 
} = graphql;

const myKids = new graphql.GraphQLObjectType({
    name: 'child',
    fields: () => {
        return{
            name:{
                type: graphql.GraphQLString
            },
            id: {
                type: graphql.GraphQLInt
            },
            birthday: {
                type: GraphQLDateTime,
            },
            lat: {
                type: graphql.GraphQLInt
            },
            long: {
                type: graphql.GraphQLInt
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
module.exports = { myKids, kidsBirthdays }
