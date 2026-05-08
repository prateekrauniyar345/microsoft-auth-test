/**
 * Home Page Component
 * 
 * This is the landing page of the application that is shown to unauthenticated users.
 * It provides:
 * 
 * 1. Welcome message and app description
 * 2. Login call-to-action
 * 3. Features overview
 * 4. Benefits of signing in
 * 5. Information about Microsoft authentication
 * 
 * Uses React Bootstrap components for responsive design and professional appearance.
 */

import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'; 

/**
 * Home page component for unauthenticated users
 */
function Home() {
  // Get MSAL instance for authentication operations
  const { isAuthenticated, instance, inProgress, login } = useAuth();


  const handleLogin = async () => {
    if (inProgress !== 'none') {
      console.warn('Authentication interaction already in progress:', inProgress)
      return
    }
    try {
      // This will redirect to Microsoft login
      // Do NOT try to execute code after this - it won't run due to redirect
      await login()
    } catch (error) {
      console.error('Login error:', error)
    }
  }
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                <i className="bi bi-shield-check me-3"></i>
                Welcome to Microsoft Auth Test
              </h1>
              <p className="lead mb-4">
                A secure React application demonstrating Microsoft Authentication 
                using MSAL (Microsoft Authentication Library). Experience enterprise-grade 
                security with your Microsoft account.
              </p>
              <Button 
                variant="light" 
                size="lg" 
                onClick={handleLogin}
                className="px-4 py-2"
              >
                <i className="bi bi-microsoft me-2"></i>
                Sign In with Microsoft
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-6 mb-3">Why Choose Microsoft Authentication?</h2>
            <p className="lead text-muted">
              Secure, reliable, and trusted by millions of users worldwide
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Security Feature */}
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title className="h4">Enterprise Security</Card.Title>
                <Card.Text className="text-muted">
                  Multi-factor authentication, conditional access, and advanced threat 
                  protection keep your account secure.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Single Sign-On Feature */}
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-key text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title className="h4">Single Sign-On</Card.Title>
                <Card.Text className="text-muted">
                  Sign in once and access all your Microsoft services seamlessly. 
                  No need to remember multiple passwords.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Privacy Feature */}
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-eye-slash text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <Card.Title className="h4">Privacy First</Card.Title>
                <Card.Text className="text-muted">
                  Your data is protected by Microsoft's privacy commitments. 
                  We only request the permissions you approve.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* What You'll Get Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 mb-3">What You'll Get After Signing In</h2>
              <p className="lead text-muted">
                Unlock powerful features designed for authenticated users
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Dashboard Access */}
            <Col md={6}>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-speedometer2 text-primary fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Personal Dashboard</h5>
                  <p className="text-muted mb-0">
                    Access your personalized dashboard with real-time information 
                    and quick actions tailored to your needs.
                  </p>
                </div>
              </div>
            </Col>

            {/* Profile Management */}
            <Col md={6}>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-person-gear text-success fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Profile Management</h5>
                  <p className="text-muted mb-0">
                    View and manage your Microsoft profile information, 
                    including personal details and preferences.
                  </p>
                </div>
              </div>
            </Col>

            {/* Secure Data */}
            <Col md={6}>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-cloud-check text-info fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Cloud Integration</h5>
                  <p className="text-muted mb-0">
                    Seamlessly integrate with Microsoft Graph to access your 
                    Office 365 data and services.
                  </p>
                </div>
              </div>
            </Col>

            {/* Premium Features */}
            <Col md={6}>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-star text-warning fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Premium Features</h5>
                  <p className="text-muted mb-0">
                    Unlock advanced features and capabilities available only 
                    to authenticated users.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <Alert variant="info" className="p-4">
              <Alert.Heading>
                <i className="bi bi-info-circle me-2"></i>
                About This Application
              </Alert.Heading>
              <p className="mb-3">
                This is a demonstration application built with React, Vite, and 
                Microsoft Authentication Library (MSAL). It showcases how to 
                implement secure authentication using Microsoft Identity Platform.
              </p>
              <hr />
              <p className="mb-3">
                <strong>Technologies used:</strong>
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-2">
                <span className="badge bg-primary">React 18</span>
                <span className="badge bg-success">Vite</span>
                <span className="badge bg-info">MSAL</span>
                <span className="badge bg-warning text-dark">Bootstrap 5</span>
                <span className="badge bg-danger">React Router</span>
              </div>
            </Alert>
            
            <div className="mt-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleLogin}
                className="me-3"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Get Started Now
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg"
                href="https://docs.microsoft.com/en-us/azure/active-directory/develop/"
                target="_blank"
              >
                <i className="bi bi-book me-2"></i>
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home