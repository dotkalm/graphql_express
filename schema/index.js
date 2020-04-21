const graphql = require ('graphql');  
const Pool = require('pg-pool')
const Mutation = require('../mutation')
const { myKids, userInfo, kidsBirthdays} = require('../types')
const { checkAuth } = require('./users.js')

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
        const result = await client.query(`SELECT 
            id,
            lat,
            long,
            geohash,
            name,
            TO_CHAR(birthday, 'DD-MON-YYYY')AS "birthday", 
            TO_CHAR(birthday, 'HH12:MI AM')AS "time"
            FROM kids`)
        console.log(result.rows)
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
const getDetailsForChild = async (child) => {
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        const result = await client.query(`SELECT name, 
        TO_CHAR(birthday, 'DD-MON-YYYY')AS "birthday", 
        TO_CHAR(birthday, 'HH12:MI AM')AS "time" 
        FROM kids 
        WHERE name = '${child}';`)
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
                resolve: (parentValue, args, request) => {
                    return getOffspring()
                } 
            },
            birthdays: {
                type: new graphql.GraphQLList(kidsBirthdays),
                resolve: () => {
                    return getBirthdays()
                } 
            },
            getDetails: {
                type: new graphql.GraphQLList(kidsBirthdays),
                args: {
                    name: {
                        description: 'the name of the child',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                },
                resolve: (root, {name}) => {
                    return getDetailsForChild(name)
                }
            },
            logIn: {
                type:   new graphql.GraphQLList(userInfo),
                args: {
                    username: {
                        description: 'username',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    },
                    password: {
                        description: 'password',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                },
                resolve: (root, args, context) => {
                    const { username, password } = args
                    if(checkAuth(dbConfig, username, password)){
                        context.session.logged = true
                        console.log(context.session)
                        return [{username: username}]
                    }
                }
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
