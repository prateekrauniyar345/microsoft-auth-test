/**
 * Error Boundary Component
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree
 * that crashed. This helps provide a better user experience when unexpected
 * errors occur.
 * 
 * Features:
 * - Catches and logs JavaScript errors
 * - Displays user-friendly error message
 * - Provides recovery options (reload, go home)
 * - Development mode shows error details
 * - Production mode shows generic error message
 */

import React from 'react'
import { Container, Alert, Button, Card } from 'react-bootstrap'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    
    // Initialize state with no error
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  /**
   * Update state so the next render will show the fallback UI
   * This lifecycle method is called when an error is thrown by a descendant component
   */
  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true }
  }

  /**
   * Log error details and update state with error information
   * This lifecycle method is called when an error is thrown by a descendant component
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Update state with error details for potential display
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // You can also log the error to an error reporting service here
    // For example: logErrorToService(error, errorInfo)
  }

  /**
   * Reset the error boundary state
   * This allows users to attempt recovery without a full page reload
   */
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  /**
   * Reload the entire page
   * This is a more aggressive recovery method
   */
  handleReload = () => {
    window.location.reload()
  }

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    // If there's an error, render the fallback UI
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <Container className="mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <Card className="shadow">
                <Card.Header className="bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Something went wrong
                  </h4>
                </Card.Header>
                
                <Card.Body>
                  <Alert variant="danger">
                    <Alert.Heading>Application Error</Alert.Heading>
                    <p>
                      We're sorry, but something unexpected happened. 
                      The application has encountered an error and needs to recover.
                    </p>
                  </Alert>

                  {/* Show error details in development mode */}
                  {isDevelopment && this.state.error && (
                    <Alert variant="warning">
                      <Alert.Heading>Error Details (Development Mode)</Alert.Heading>
                      <details className="mt-3">
                        <summary className="fw-bold">Error Message</summary>
                        <pre className="mt-2 small">
                          {this.state.error && this.state.error.toString()}
                        </pre>
                      </details>
                      
                      {this.state.errorInfo && (
                        <details className="mt-3">
                          <summary className="fw-bold">Stack Trace</summary>
                          <pre className="mt-2 small">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </Alert>
                  )}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button 
                      variant="primary" 
                      onClick={this.handleReset}
                      className="me-md-2"
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={this.handleReload}
                      className="me-md-2"
                    >
                      <i className="bi bi-bootstrap-reboot me-2"></i>
                      Reload Page
                    </Button>
                    
                    <Button 
                      variant="outline-primary" 
                      onClick={this.handleGoHome}
                    >
                      <i className="bi bi-house me-2"></i>
                      Go Home
                    </Button>
                  </div>
                </Card.Body>
                
                <Card.Footer className="text-center text-muted">
                  <small>
                    If this problem persists, please contact support.
                  </small>
                </Card.Footer>
              </Card>
            </div>
          </div>
        </Container>
      )
    }

    // If there's no error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary