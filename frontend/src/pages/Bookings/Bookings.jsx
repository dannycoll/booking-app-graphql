import React, { useEffect, useState, useContext } from "react";

import "./Bookings.css";
import Spinner from "../../components/Spinner/Spinner";
import BookingList from "../../components/BookingsList/BookingsList";

import AuthContext from "../../context/authContext";

const BookingsPage = () => {
  useEffect(() => {
    fetchBookings();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const authContext = useContext(AuthContext);

  const fetchBookings = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
              bookings {
                  _id
                  createdAt
                  event {
                      _id
                      title
                      date
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
          Authorization: "Bearer " + authContext.token,
        },
      });
      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");
      const resData = await res.json();
      const resBookings = resData.data.bookings;
      console.log(resBookings);
      setBookings(resBookings);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
      mutation CancelBooking($id: ID!) {
        cancelBooking(bookingId: $id) {
        _id
         title
        }
      }
    `,
      variables: {
        id: bookingId,
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
      setBookings(bookings.filter((x) => x._id !== bookingId));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBooking} />
      )}
    </>
  );
};

export default BookingsPage;
