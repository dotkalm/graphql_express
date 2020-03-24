const {MongoClient, ObjectId} = require('mongodb')

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const Schema = require('./schema/')
const MONGO_URL = 'mongodb://localhost:27017/stocktalk10'



app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
