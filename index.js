const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const session = require('express-session')
const cors = require('cors')
const Schema = require('./schema/')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000
require('dotenv').config()

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))


const root = {
    getDetailsForChild: ({name}) => {
    }
}
app.use(session(
    { 
        secret: process.env.MIDDLEWARE_SECRET, 
        cookie: { maxAge: 60000 }, 
        proxy: true,
        resave: true,
        saveUninitialized: true
    })
);
app.use('/graphql',(req, res) => {
    return graphqlHTTP({
    schema: Schema,
    rootValue: root,
    graphiql: true,
    context: {req, res},
    })(req, res);
})

app.listen(PORT);

