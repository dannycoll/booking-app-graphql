const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql'); 
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const app = express();

const Event = require('./models/event');
const User = require('./models/user');

const graphqlOptions = {
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput {
            title: String!
            description: String
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(input: EventInput): Event
            createUser(input: UserInput): User 
        }

        schema {
            query: RootQuery 
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().populate('creator')
                .then(events => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                            _id: event._doc._id.toString(),
                            creator: user.bind(this, event.creator)
                        }
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        },
        createEvent: (args) => {
            const { input } = args;
            const event = new Event({
                title: input.title,
                description: input.description,
                price: +input.price,
                date: new Date(input.date),
            });
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = {
                        ...result._doc,
                        _id: result._doc._id.toString(),
                        creator: user.bind(result._doc.creator)
                    };
                    return User.findById('6147bca61c579f3a4574c0cf');
                })
                .then(user => {
                    if(!user) throw new Error('User does not exist.');
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(error => {
                    throw error;
                });
        },
        createUser: (args) => {
            const { input } = args;
            return User.findOne({ email: input.email })
                .then(user => {
                    if(user){
                        throw new Error('User with this email already exists');
                    }
                    return bycrypt.hash(input.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: input.email,
                        password: hashedPassword,
                    });
                    return user.save()
                })
                .then(result => {
                    return {...result._doc, password: null, _id: result.id}
                })
                .catch(error => {
                    throw error;
                });
        }

    },
    graphiql: true,
}

const events = eventIds => {
    return Event.find({_id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event.creator)
                };
            });
        });
}
const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
        })
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