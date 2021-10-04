import React, { useEffect, useState, useContext } from "react";

import Spinner from "../../components/Spinner/Spinner";

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

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
            {booking.event.title} -{' '}
            {new Date(booking.createdAt).toLocaleDateString()}
          </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default BookingsPage;
