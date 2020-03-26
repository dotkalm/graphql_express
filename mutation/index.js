const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLObjectType } = graphql;
const { myKids } = require('../types')

const removeOffspring = async (name) => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        return client.query(`DELETE FROM kids WHERE name = ${name}`)
    } finally{
        client.release()
    }
}

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        deleteChild: {
            type: myKids,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                return removeOffSpring(args) 
            }
        }
    })
})

module.exports = Mutation
