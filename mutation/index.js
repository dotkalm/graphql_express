const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLObjectType, GraphQLFloat } = graphql;
const { myLocations, userInfo } = require('../types')
const { Client } = require('pg');
const {addUser} = require('./users.js')
require('dotenv').config()

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

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
    const {name, lat, long} = args
    const pool = new Pool(dbConfig)
    console.log(args)
    const client = await pool.connect()
    try{
        return client.query(`
            INSERT INTO locations (name, birthplace, lat, long, geohash) 
            VALUES (
                '${name}', 
                '(${long},${lat})', 
                ${lat}, ${long}, 
                ST_GeoHash(ST_MakePoint(${long},${lat})));`)
    } finally{
        client.release()
    }
}

const renameOffspring = async (args) => {
    const {newName, oldName} = args
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        return client.query(`UPDATE kids SET name = '${newName}' WHERE name = '${oldName}';`)
    } finally{
        client.release()
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
                long: { type: new GraphQLNonNull(GraphQLFloat) }
            },
            resolve(parent, args){
                return addMyLocation(args)
                    .then(res => {
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
        renameChild: {
            type: myLocations,
            args: {
                newName: { type: new GraphQLNonNull(GraphQLString) },
                oldName: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                return renameOffspring(args)
                    .then(res => {
                        if (res) {
                            return res
                        }
                        return new Error(`child no can be created`)
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
                return addUser(args, dbConfig)
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
