import React, { useState, useContext, useEffect, useRef } from 'react'

import AuthContext from '../../context/authContext';
import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

import './Events.css';

const EventsPage = () => {
    const authContext = useContext(AuthContext);

    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);

    const titleRef = useRef('');
    const descriptionRef = useRef('');
    const dateRef = useRef('');
    const priceRef = useRef(0.00);

    const startCreateEventHandler = () => setCreating(true);
    const closeModalHandler = () => setCreating(false);

    const modalConfirmHandler = async () => {
        const title = titleRef.current.value;
        const description = descriptionRef.current.value;
        const price = priceRef.current.value;
        const date = dateRef.current.value;
        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) return;

        const requestBody = {
            query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                _id
                title
                description
                date
                price
                creator {
                    _id
                    email
                }
                }
            }
            `
        };

        const token = authContext.token;
        try {
            const res = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            fetchEvents();

        } catch (err) {
            console.log(err);
        };
    }
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const requestBody = {
            query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
                }
              }
            `
        };
        try {
            const res = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!');
            const resData = await res.json();
            const events = resData.data.events;
            setEvents(events);
        } catch (err) {
            console.log(err);
        };
    }

    const eventList = events.map(event => {
        return (
            <li key={event._id} className="events_list-item">
                {event.title}
            </li>
        );
    });
    return (
        <>
            {creating && <Backdrop />}
            {creating &&
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={closeModalHandler}
                    onConfirm={modalConfirmHandler}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={dateRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                ref={descriptionRef}
                            />
                        </div>
                    </form>
                </Modal>
            }
            {authContext.token && <div className="events-control">
                <p>Share your events!</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>}

            <ul className="events_list">{eventList}</ul>
        </>
    );
}

export default EventsPage;