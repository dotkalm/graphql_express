const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const session = require('express-session')
const Schema = require('./schema/')
const bodyParser = require('body-parser');



const root = {
    ip: function (args, request){
        return request.ip;
    }
}
app.use(session(
    { 
        secret: 'keyboard cat', 
        cookie: { maxAge: 60000 }, 
        proxy: true,
        resave: true,
        saveUninitialized: true
    })
);

app.use(
    '/graphql', 
    graphqlHTTP({
    schema: Schema,
    rootValue: root,
    graphiql: true,
    }));

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql')
