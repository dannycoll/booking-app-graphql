import React, { useState, useContext, useEffect, useRef } from "react";

import AuthContext from "../../context/authContext";
import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";
import EventList from "../../components/EventsList/EventList";
import Spinner from "../../components/Spinner/Spinner";

import "./Events.css";

const EventsPage = () => {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    fetchEvents();
  }, []);
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const dateRef = useRef("");
  const priceRef = useRef(0.0);

  const startCreateEventHandler = () => setCreating(true);
  const closeModalHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const modalConfirmHandler = async () => {
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const price = priceRef.current.value;
    const date = dateRef.current.value;
    if (
      title.trim().length === 0 ||
      price < 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    )
      return;

    const requestBody = {
      query: `
            mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
              createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
                _id
                title
                description
                date
                price
              }
            }
          `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date,
      },
    };

    const token = authContext.token;
    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      const updatedEvents = events;
      updatedEvents.push({
        _id: resData.data.createEvent._id,
        title: resData.data.createEvent.title,
        description: resData.data.createEvent.description,
        date: resData.data.createEvent.date,
        price: resData.data.createEvent.price,
        creator: {
          _id: authContext.userId,
        },
      });
      setEvents(updatedEvents);
      setCreating(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
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
            `,
    };
    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");
      const resData = await res.json();
      const events = resData.data.events;
      setEvents(events);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const showDetailHandler = (eventId) => {
    setSelectedEvent(events.find((x) => x._id === eventId));
  };

  const bookEventHandler = async () => {
    if (!authContext.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
      variables: {
        id: this.state.selectedEvent._id,
      },
    };
    try {
      const res = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authContext.token,
        },
      });
      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");

      setSelectedEvent(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={closeModalHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
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
              <textarea id="description" rows="4" ref={descriptionRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={closeModalHandler}
          onConfirm={bookEventHandler}
          confirmText={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className="events-control">
          <p>Share your events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;
