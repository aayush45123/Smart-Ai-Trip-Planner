import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/SignUp/SignUp";
import Planner from "./pages/Planner/Planner";
import TripResult from "./pages/TripResult/TripResult";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <TripResult />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
