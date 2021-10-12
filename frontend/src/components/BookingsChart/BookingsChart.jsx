import React from "react";
import Chart from "react-google-charts";

import Spinner from './../Spinner/Spinner';
const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
    name: 'Cheap'
  },
  Normal: {
    min: 100,
    max: 200,
    name: 'Normal'
  },
  Expensive: {
    min: 200,
    max: 10000000,
    name: 'Expensive'
  },
};

const bookingsChart = (props) => {
  let chartData = { labels: [], datasets: [] };
  let values = [["Bucket", "Amount"]];
  let ticks = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price >= BOOKINGS_BUCKETS[bucket].min &&
        current.event.price <= BOOKINGS_BUCKETS[bucket].max
      ) {
        ticks.push(prev+1);
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push([bucket, filteredBookingsCount]);
  }
  
  ticks.push(ticks[ticks.length-1]+1);
  return (
    <Chart
      width={"500px"}
      height={"300px"}
      chartType="BarChart"
      loader={<Spinner />}
      data={
        values
      }
      options={{
        title: "Booked Events",
        chartArea: { width: "100%" },
        hAxis: {
          title: "Amount",
          minValue: 0,
          ticks: ticks
        },
        vAxis: {
          title: "Price",
        },
      }}
    />
  );
};

export default bookingsChart;
