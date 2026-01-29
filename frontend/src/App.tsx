import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subject from "./pages/Subject";
import Landing from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddSubject from "./pages/AddSubject";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          />
          <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects/:id"
            element={
              <ProtectedRoute>
                <Subject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/add"
            element={
              <ProtectedRoute>
                <AddSubject />
              </ProtectedRoute>
            }
          />
          {/*Fallback route*/}
          <Route path="*" element={<div className="p-8">404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
