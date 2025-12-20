import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Planner from "./pages/Planner";
import TripResult from "./pages/TripResult";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
