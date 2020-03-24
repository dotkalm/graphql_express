const {MongoClient, ObjectId} = require('mongodb')
const MONGO_URL = 'mongodb://localhost:27017/stocktalk10'
const graphql = require ('graphql');  
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('graphql1.sqlite');

const fetchDB = () => {
}
const queryType = new graphql.GraphQLObjectType({  
  name: 'Query',
    fields: () => {
        return {
            kids: {
                type: graphql.GraphQLString,
                resolve: () => {
                    return new Promise((res,rej) => {
                        db.each('SELECT * FROM users',(err,row)=>{
                            if(err){
                                throw err
                            }
                            res(row.name)
                        })
                    }) 
                }
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: queryType
});
