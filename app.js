const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');
const app = express();

const graphqlOptions = {
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}

app.use(bodyParser.json());
app.use(isAuth);
app.use('/graphql', graphqlHTTP(graphqlOptions));

const connectionString =
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ndsg4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(connectionString)
    .then(() => {
        app.listen(3000);
    }).catch(error => {
        console.log(error);
    });