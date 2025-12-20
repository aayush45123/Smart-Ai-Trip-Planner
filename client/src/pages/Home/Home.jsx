import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Smart Budget Trip Planner</h1>
      <button onClick={() => navigate("/planner")}>
        Plan a Trip
      </button>
    </div>
  );
}
