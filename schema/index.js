const graphql = require ('graphql');  
const Pool = require('pg-pool')
const Mutation = require('../mutation')

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'graphql_hello',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const getOffspring = async () => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        const result = await client.query('SELECT * FROM kids')
        return result.rows
    } finally{
        client.release()
    }
}

const myKids = new graphql.GraphQLObjectType({
    name: 'child',
    fields: () => {
        return{
            name:{
                type: graphql.GraphQLString
            }
        }
    }
})
const RootQuery = new graphql.GraphQLObjectType({  
    name: 'Query',
    fields: () => {
        return {
            kids: {
                type: new graphql.GraphQLList(myKids),
                resolve: () => {
                    return getOffspring()
                } 
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
