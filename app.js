const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql'); 
const mongoose = require('mongoose');
const app = express();

const Event = require('./models/event');

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
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event._doc._id.toString()}
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.input.title,
                description: args.input.description,
                price: +args.input.price,
                date: new Date(args.input.date),
            });
             return event.save().then(result => {
                console.log(result);
                return {...result._doc, _id: result._doc._id};
            }).catch(error => {
                console.log(error);
            });
        }

    },
    graphiql: true,
}
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP(graphqlOptions));

const connectionString =
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ndsg4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(connectionString)
    .then(() => {
        app.listen(3000);
    }).catch(error => {
        console.log(error);
    });