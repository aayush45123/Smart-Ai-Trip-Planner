import { Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/SignUp/SignUp";
import Planner from "./pages/Planner/Planner";
import TripResult from "./pages/TripResult/TripResult";
import Home from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";


import "./App.css";
import CustomCursor from "./components/CustomCursor/CustomCursor";

export default function App() {
  return (
    <>
      {/* 🔥 Global Splash Cursor */}
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
