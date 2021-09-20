const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bycrypt = require('bcryptjs');

const events = async eventIds => {
    try {
        const events = await Event.find({_id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch(error) {
        throw error;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
        }
    }catch(error){
        throw error;
    }
}
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
        
    } catch(error) {
        throw error;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = Event.find().populate('creator')
            events.map(event => {
                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            })
        } catch(error) {
                throw error;
            }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
            });
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) => {
        try {
            const { input } = args;
            const event = new Event({
                title: input.title,
                description: input.description,
                price: +input.price,
                date: new Date(input.date),
            });
            let createdEvent;
            const result = event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(result._doc.creator)
            };
            const creator = await User.findById('6147bca61c579f3a4574c0cf');
            if(!creator) throw new Error('User does not exist.');
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch(error) {
            throw error;
        }
    },
    createUser: async (args) => {
        try {
            const { input } = args;
            const user = await User.findOne({ email: input.email });
            if(user){
                throw new Error('User with this email already exists');
            }
            const hashedPassword = await bycrypt.hash(input.password, 12);
            const newUser = new User({
                email: input.email,
                password: hashedPassword,
            });
            const result = await newUser.save()
            return {...result._doc, password: null, _id: result.id}
        }catch(error){
            throw error;
        };
    },
    bookEvent: async (args) => {
        try {
            const event = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: '',
                event: event,
            });
            const result = await booking.save();
            return {
                ...result._doc,
                _id: result.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            }
        }catch(error){
            throw error;
        }
    },
    cancelBooking: async (args) => {
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = { ...booking.event._doc, _id: booking.event.id, creator: user.bind(this, booking.event._doc.creator) }
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch(error){
            throw error;
        }
    }

}