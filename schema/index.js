const graphql = require ('graphql');  
const Pool = require('pg-pool')
const Mutation = require('../mutation')
const { myKids, kidsBirthdays } = require('../types')

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

const getBirthdays = async () => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        const result = await client.query(`SELECT name, 
        TO_CHAR(birthday, 'DD-MON-YYYY')AS "birthday", 
        TO_CHAR(birthday, 'HH12:MI AM')AS "time" 
        FROM kids;`)
        console.log(result.rows)
        return result.rows
    } finally{
        client.release()
    }
}
const RootQuery = new graphql.GraphQLObjectType({  
    name: 'Query',
    fields: () => {
        return {
            kids: {
                type: new graphql.GraphQLList(myKids),
                resolve: () => {
                    return getOffspring()
                } 
            },
            birthdays: {
                type: new graphql.GraphQLList(kidsBirthdays),
                resolve: () => {
                    return getBirthdays()
                } 
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
