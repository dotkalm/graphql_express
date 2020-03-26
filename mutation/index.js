const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLObjectType } = graphql;

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        deleteChild: {
            args: {
                name: {}
            },
            resolve(parent, args){
                return 
            }
        }
    })
})

module.exports = Mutation
