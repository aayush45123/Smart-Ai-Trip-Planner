import { useState } from "react";
import MapView from "../../components/MapView/MapView";

export default function TripResult() {
  const trips = JSON.parse(localStorage.getItem("trips"));
  const [selected, setSelected] = useState(trips[0]);

  return (
    <div>
      <h2>Trip Options</h2>

      {trips.map((trip, i) => (
        <div key={i} onClick={() => setSelected(trip)}>
          <h4>{trip.destination}</h4>
          <p>₹{trip.totalCost}</p>
        </div>
      ))}

      <MapView startCity="Pune" destination={selected.destination} />
    </div>
  );
}
