const graphql = require ('graphql');  
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('graphql1.sqlite');

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
                            console.log(row.name)
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
