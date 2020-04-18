const graphql = require('graphql');
const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLObjectType, GraphQLFloat } = graphql;
const { myKids } = require('../types')
const Pool = require('pg-pool')

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'graphql_hello',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const removeOffspring = async (args) => {
    const {name} = args
    const pool = new Pool(dbConfig)
    const client = await pool.connect()
    try{
        return client.query(`DELETE FROM kids WHERE name = '${name}';`)
    } finally{
        client.release()
    }
}

const addOffspring = async (args) => {
    const {name, lat, long} = args
    const pool = new Pool(dbConfig)
    console.log(args)
    const client = await pool.connect()
    try{
        return client.query(`
        INSERT INTO kids (name, birthplace, lat, long, geohash) 
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
        addChild: {
            type: myKids,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                lat: { type: new GraphQLNonNull(GraphQLFloat) },
                long: { type: new GraphQLNonNull(GraphQLFloat) }
            },
            resolve(parent, args){
                return addOffspring(args)
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
        renameChild: {
            type: myKids,
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
            type: myKids,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                return removeOffspring(args)
            }
        }
    })
})

module.exports = Mutation
