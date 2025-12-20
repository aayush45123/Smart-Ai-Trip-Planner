import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Planner() {
  const [startCity, setStartCity] = useState("Pune");
  const [budget, setBudget] = useState(5000);
  const [days, setDays] = useState(2);

  const navigate = useNavigate();

  async function generateTrip() {
    const res = await api.post("/trips/generate", {
      startCity,
      budget,
      days,
    });

    localStorage.setItem("trips", JSON.stringify(res.data.trips));
    navigate("/result");
  }

  return (
    <div>
      <h2>Plan Your Trip</h2>

      <select onChange={(e) => setStartCity(e.target.value)}>
        <option>Pune</option>
        <option>Mumbai</option>
        <option>Nashik</option>
      </select>

      <input
        type="range"
        min="2000"
        max="10000"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <p>Budget: ₹{budget}</p>

      <input
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <button onClick={generateTrip}>Generate Trip</button>
    </div>
  );
}
