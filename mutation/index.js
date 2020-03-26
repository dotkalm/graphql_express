const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLObjectType } = graphql;

const Mutation = new GraphQLObjectType({
    name: 'Mutation',

})

module.exports = Mutation
