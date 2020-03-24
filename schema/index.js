const graphql = require ('graphql');  
const Pool = require('pg-pool')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('graphql1.sqlite');
const dbConfig = {
  user: 'joel',
  host: 'localhost',
  database: 'graphql_hello',
  password: 'Lewis2017Francesca2019',
  port: 5432,
}

const getOffspring = async () => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        const result = await client.query('SELECT * FROM kids')
        console.log(result.rows)
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
const queryType = new graphql.GraphQLObjectType({  
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
    query: queryType
});
