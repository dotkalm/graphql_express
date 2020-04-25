const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLFloat } = graphql;
const { myLocations, userInfo } = require('../types')
const { Client } = require('pg');
const {addUser} = require('./users.js')
require('dotenv').config()


let ssl = false

if(process.env.ON_HEROKU === 1){
    ssl = true
}

const removeOffspring = async (args) => {
    const {name} = args

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl
    });
    client.connect()

    try{
        return client.query(`DELETE FROM kids WHERE name = '${name}';`)
    } finally{
        client.end();
    }
}

const addMyLocation = async (args) => {
    const {name, lat, long, id} = args
    console.log(args)
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl
    });
    client.connect()

    try{
        const sendToDB = await client.query(`
            INSERT INTO locations (name, location, lat, long, geohash, user_id) 
            VALUES (
                '${name}', 
                '(${long},${lat})', 
                ${lat}, 
                ${long}, 
                ST_GeoHash(ST_MakePoint(${long},${lat})),
                ${id}
                );`)
        console.log(sendToDB)
        return sendToDB
    } finally{
        client.end();
    }
}

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addLocation: {
            type: myLocations,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                lat: { type: new GraphQLNonNull(GraphQLFloat) },
                long: { type: new GraphQLNonNull(GraphQLFloat) },
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args){
                console.log(args)
                return addMyLocation(args)
                    .then(res => {
                        console.log(res)
                        if (res) {
                            return res
                        }
                        return new Error(`Location Could Not Be Added`)
                    })
                    .catch(() => {
                        return new Error(`bigtime error`)
                    })
            }
        },
        deleteChild: {
            type: myLocations,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                return removeOffspring(args)
            }
        },
        addUser: {
            type: userInfo,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                hashedPassword: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                return addUser(args)
                    .then(res => {
                        if (res) {
                            return res
                        }
                        return new Error(`user no can be created`)
                    })
                    .catch(() => {
                        return new Error(`bigtime error making user`)
                    })
            }
        }
    })
})

module.exports = Mutation
