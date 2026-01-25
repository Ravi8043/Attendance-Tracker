import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subject from './pages/Subject';

function App() {
  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-100'>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* if authenticated then show dashboard else login */}
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/subjects/:id'
          element={
            <ProtectedRoute>
              <Subject />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App
