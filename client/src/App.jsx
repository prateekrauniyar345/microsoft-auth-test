/**
 * Main App Component
 * 
 * This is the root component of the application that handles:
 * 1. Authentication state management
 * 2. Route protection and navigation
 * 3. Global error handling
 * 4. Loading states during authentication
 * 
 * The component uses MSAL (Microsoft Authentication Library) to manage
 * authentication state and protect routes based on user login status.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

// Import page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BackendPage from './pages/BackendPage';

// Import layout components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Import custom styles
import './App.css';

/**
 * Main Application Component
 */
function App() {
  // Get authentication status from MSAL
  const isAuthenticated = useIsAuthenticated()
  console.log('Is user authenticated?', isAuthenticated)
  const { instance, inProgress } = useMsal()
  
  // Local state for loading and error handling
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Effect to handle initial authentication check
   * This runs when the app loads to determine if we have an active session
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for MSAL to finish initializing
        await instance.initialize()
        
        // Check if we have accounts and handle the active account
        const accounts = instance.getAllAccounts()
        if (accounts.length > 0 && !instance.getActiveAccount()) {
          instance.setActiveAccount(accounts[0])
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing authentication:', error)
        setError('Failed to initialize authentication system')
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [instance])

  /**
   * Handle global error recovery
   */
  const handleErrorRetry = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  // Show loading spinner while MSAL is processing
  if (isLoading || inProgress === 'startup') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Initializing application...</p>
        </div>
      </div>
    )
  }

  // Show error state with retry option
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Application Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-danger" 
              onClick={handleErrorRetry}
            >
              Retry
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          {/* Navigation component - shows different options based on auth status */}
          <Navigation />
          
          {/* Main content area */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Home />
                } 
              />
              
              <Route 
                path="/home" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Home />
                } 
              />

              {/* Protected Routes - require authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />


              {/* Backend route */}
              <Route 
                path="/backend" 
                element={
                    <BackendPage />
                } 
              />

              {/* Catch-all route for 404 errors */}
              <Route 
                path="*" 
                element={
                  <Container className="mt-5 text-center">
                    <div className="py-5">
                      <h1 className="display-1 text-muted">404</h1>
                      <h2>Page Not Found</h2>
                      <p className="text-muted">
                        The page you're looking for doesn't exist.
                      </p>
                      <div className="mt-4">
                        <a href="/" className="btn btn-primary me-2">
                          Go Home
                        </a>
                        {isAuthenticated && (
                          <a href="/dashboard" className="btn btn-outline-primary">
                            Go to Dashboard
                          </a>
                        )}
                      </div>
                    </div>
                  </Container>
                } 
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-light text-center text-muted py-3 mt-auto">
            <Container>
              <small>
                © 2024 Microsoft Authentication Demo App
                {isAuthenticated && (
                  <span className="ms-2">
                    <i className="bi bi-shield-check text-success"></i>
                    Authenticated
                  </span>
                )}
              </small>
            </Container>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App