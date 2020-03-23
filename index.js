const {MongoClient, ObjectId} = require('mongodb')

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const Schema = require('./schema/')
const MONGO_URL = 'mongodb://localhost:27017/stocktalk10'

//const db = MongoClient.connect(MONGO_URL)

// Construct a schema, using GraphQL schema language
//
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
