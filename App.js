import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';
import AddTask from './components/AddTask';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route component (for login/signup)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const headStyle = {
    textAlign: "center",
  };

  const appBackgroundStyle = {
    backgroundImage: 'url(https://wallpaperaccess.com/full/6245530.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    minHeight: '100vh',
    color: 'white',
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={appBackgroundStyle}>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <h1 style={headStyle}>Todo List</h1>
                  <Home />
                </>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <>
                  <h1 style={headStyle}>Todo List</h1>
                  <Todo />
                </>
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <>
                  <h1 style={headStyle}>Todo List</h1>
                  <AddTask />
                </>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
