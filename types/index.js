const graphql = require('graphql');

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
            }
        }
    }
})

module.exports = { myKids }
