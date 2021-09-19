const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql'); 
const app = express();

const graphqlOptions = {
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String  
        }

        schema {
            query: RootQuery 
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Hello', 'World'];
        },
        createEvent: (args) => {
            const { name } = args;
            return name;
        }

    },
    graphiql: true,
}
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP(graphqlOptions));

app.listen(3000);