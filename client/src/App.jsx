import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/SignUp/SignUp";
import Planner from "./pages/Planner/Planner";
import TripResult from "./pages/TripResult/TripResult";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import "./App.css";

export default function App() {
  return (
    <>
      {/* Add Custom Cursor */}
      <CustomCursor />

      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

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
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
