const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql'); 
const app = express();

const events = [] 
const graphqlOptions = {
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(input: EventInput): Event  
        }

        schema {
            query: RootQuery 
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.input.title,
                description: args.input.description,
                price: +args.input.price,
                date: args.input.date,
            }
            events.push(event);
            return event;
        }

    },
    graphiql: true,
}
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP(graphqlOptions));

app.listen(3000);