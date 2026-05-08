/**
 * Protected Route Component
 * 
 * This component is used to protect routes that require authentication.
 * It checks if the user is authenticated before rendering the protected content.
 * If not authenticated, it redirects to the home page or shows a login prompt.
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourProtectedComponent />
 * </ProtectedRoute>
 */

import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { Container, Card, Button, Alert } from 'react-bootstrap'
import { loginRequest } from '../lib/msalConfig'

/**
 * ProtectedRoute component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 */
function ProtectedRoute({ children }) {
  // Get authentication state and MSAL instance
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()

  /**
   * Handle user sign-in
   */
  const handleLogin = async () => {
    if (inProgress !== 'none') {
      console.warn('Authentication interaction already in progress:', inProgress)
      return
    }
    try {
      await instance.loginRedirect(loginRequest)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Show loading state while authentication is in progress
  if (inProgress === 'login' || inProgress === 'ssoSilent') {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Authenticating...</span>
          </div>
          <p className="mt-3">Signing you in...</p>
        </div>
      </Container>
    )
  }

  // If user is authenticated, render the protected content
  if (isAuthenticated) {
    return children
  }

  // If user is not authenticated, show login prompt
  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-shield-lock me-2"></i>
                Authentication Required
              </h4>
            </Card.Header>
            <Card.Body className="text-center p-4">
              <Alert variant="info" className="mb-4">
                <i className="bi bi-info-circle me-2"></i>
                You need to sign in to access this page.
              </Alert>
              
              <div className="mb-4">
                <i className="bi bi-lock text-muted" style={{ fontSize: '3rem' }}></i>
              </div>

              <p className="text-muted mb-4">
                This page is protected and requires authentication. 
                Please sign in with your Microsoft account to continue.
              </p>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleLogin}
                >
                  <i className="bi bi-microsoft me-2"></i>
                  Sign In with Microsoft
                </Button>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => window.history.back()}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Go Back
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="text-center text-muted">
              <small>
                <i className="bi bi-shield-check me-1"></i>
                Secure authentication powered by Microsoft
              </small>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default ProtectedRoute