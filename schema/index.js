const graphql = require ('graphql');  
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('graphql1.sqlite');
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
                    return new Promise(
                        (resolve,reject) => {
                        const kidsArray = new Array
                        db.each('SELECT * FROM users',
                            (err,row)=>{
                            if(err){
                                throw err
                            }
                            kidsArray.push(row)
                        })
                        setTimeout(() => {
                            console.log(kidsArray)
                            resolve(kidsArray)
                        }, 10)
                    }) 
                }
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: queryType
});
