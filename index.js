const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const session = require('express-session')
const cors = require('cors')
const bcrypt    = require('bcrypt');
const Schema = require('./schema/')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000

app.use(cors())

const hashedPassword = bcrypt.hashSync('password', bcrypt.genSaltSync(10));
console.log( hashedPassword )

const root = {
    getDetailsForChild: ({name}) => {
        console.log("um")
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

app.listen(PORT);

console.log('Running a GraphQL API server at http://localhost:4000/graphql')
