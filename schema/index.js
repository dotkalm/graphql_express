const graphql = require ('graphql');  
const Pool = require('pg-pool')
const { Client } = require('pg');
const Mutation = require('../mutation')
const { myKids, userInfo, kidsBirthdays} = require('../types')
const { checkAuth } = require('./users.js')
require('dotenv').config()

let ssl = false
if(process.env.ON_HEROKU === 1){
    ssl = true
}
const getOffspring = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl
    });
    client.connect()
    try{
        const result = await client.query(`
            SELECT
            name,
            TO_CHAR(birthday, 'HH12:MI AM')AS "time" 
            FROM kids;`)
        return result.rows
    } finally{
        client.end();
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
                resolve: (root, args, context) => {
                    const { logged } = context.req.session
                    if (!logged) {
                        return []
                    }else{
                        return getBirthdays()
                    }
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
                    return checkAuth(dbConfig, username, password, context)
                }
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
