import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/planner");
    } catch (err) {
      alert("Signup failed");
    }
  }

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
