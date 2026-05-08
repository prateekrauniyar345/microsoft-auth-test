/**
 * Dashboard Page Component
 * 
 * This is a protected page that is only accessible to authenticated users.
 * It provides:
 * 
 * 1. Welcome message with user's name
 * 2. User statistics and information cards
 * 3. Quick action buttons
 * 4. Recent activities section
 * 5. System status indicators
 * 
 * The component uses Microsoft Graph API (when available) to fetch user data
 * and displays information in an organized dashboard layout.
 */

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap'
import { loginRequest } from '../lib/msalConfig'
import { useAuth } from '../hooks/useAuth'
import AccountInformation from '../components/AccountInformation'

/**
 * Dashboard component for authenticated users
 */
function Dashboard() {
  const { isAuthenticated, instance, accounts, activeAccount, logout, exchangeTokenAndSendToBackend } = useAuth(); 

  // State for user data and loading status
  const [userProfileData, setUserProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendTokenExchangeResponse, setBackendTokenExchangeResponse] = useState(null)

  /**
   * Effect to exchange token with backend (OBO flow)
   * This runs once when dashboard loads for authenticated users
   */
  useEffect(() => {
    if (isAuthenticated && !backendTokenExchangeResponse) {
      exchangeTokenAndSendToBackend()
        .then(response => {
          console.log("Successfully exchanged token with backend:", response);
          setBackendTokenExchangeResponse(response);
        })
        .catch(error => {
          console.error("Failed to exchange token with backend:", error);
          setError("Failed to exchange token with backend");
        });
    }
  }, [isAuthenticated, backendTokenExchangeResponse]); // ← FIXED: Removed exchangeTokenAndSendToBackend

  /**
   * Effect to load user profile data when component mounts
   * This attempts to get additional user information from Microsoft Graph
   */
  useEffect(() => {
    const getUserProfile = async () => {
      if (!activeAccount) {
        setIsLoading(false)
        return
      }

      try {
        // Attempt to acquire a token silently for Microsoft Graph API
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        })


        // If we have a token, we could make Graph API calls here
        // For this demo, we'll just use the basic account information
        setUserProfileData({
          name: activeAccount.name,
          email: activeAccount.username,
          accountId: activeAccount.localAccountId,
          tenantId: activeAccount.tenantId,
          // Add mock data for demonstration
          lastLoginTime: new Date().toLocaleString(),
          accountCreated: '2023-01-15',
          totalSessions: 42,
          averageSessionTime: '15 minutes'
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error acquiring token or fetching profile:', error)
        setError('Failed to load user profile data')
        setIsLoading(false)
      }
    }

    getUserProfile()
  }, [instance, activeAccount, logout])

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    logout()
  }

  // Loading state
  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Header */}
      <div className="bg-primary text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="h2 mb-1">
                <i className="bi bi-speedometer2 me-2"></i>
                Welcome back, {userProfileData?.name || 'User'}!
              </h1>
              <p className="mb-0 opacity-75">
                Here's what's happening with your account today
              </p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Account Information Cards */}
        <Row className="g-4 mb-4">
          {/* User Profile Card */}
          <Col md={6} lg={4}>
            <Card className="h-100">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  Profile Information
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Name:</strong>
                  <br />
                  <span className="text-muted">{userProfileData?.name}</span>
                </div>
                <div className="mb-3">
                  <strong>Email:</strong>
                  <br />
                  <span className="text-muted">{userProfileData?.email}</span>
                </div>
                <div className="mb-3">
                  <strong>Account ID:</strong>
                  <br />
                  <small className="text-muted font-monospace">
                    {userProfileData?.accountId?.substring(0, 20)}...
                  </small>
                </div>
                <div>
                  <strong>Status:</strong>
                  <br />
                  <Badge bg="success">Active</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Session Statistics Card */}
          <Col md={6} lg={4}>
            <Card className="h-100">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>
                  Session Statistics
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Last Login:</strong>
                  <br />
                  <span className="text-muted">{userProfileData?.lastLoginTime}</span>
                </div>
                <div className="mb-3">
                  <strong>Total Sessions:</strong>
                  <br />
                  <span className="h4 text-success">{userProfileData?.totalSessions}</span>
                </div>
                <div className="mb-3">
                  <strong>Average Session:</strong>
                  <br />
                  <span className="text-muted">{userProfileData?.averageSessionTime}</span>
                </div>
                <div>
                  <strong>Session Health:</strong>
                  <br />
                  <ProgressBar variant="success" now={85} label="85%" />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions Card */}
          <Col md={12} lg={4}>
            <Card className="h-100">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-person-gear me-2"></i>
                    Edit Profile
                  </Button>
                  <Button variant="outline-success" size="sm">
                    <i className="bi bi-shield-check me-2"></i>
                    Security Settings
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <i className="bi bi-download me-2"></i>
                    Download Data
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    <i className="bi bi-question-circle me-2"></i>
                    Get Help
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities Section */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Activities
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="timeline">
                  {/* Mock activity items */}
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-box-arrow-in-right text-success fs-5"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold">Successful Login</div>
                      <small className="text-muted">
                        Signed in from Chrome on Windows • {new Date().toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-shield-check text-primary fs-5"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold">Security Verification</div>
                      <small className="text-muted">
                        Multi-factor authentication completed • 2 hours ago
                      </small>
                    </div>
                  </div>

                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-person-gear text-info fs-5"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold">Profile Updated</div>
                      <small className="text-muted">
                        Contact information modified • Yesterday
                      </small>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="bi bi-key text-warning fs-5"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold">Password Changed</div>
                      <small className="text-muted">
                        Account password updated successfully • 3 days ago
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-clock-history me-2"></i>
                  View All Activities
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        {/* System Status */}
        <Row className="mt-4">
          <Col>
            <Alert variant="success" className="mb-0">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                <div>
                  <strong>All Systems Operational</strong>
                  <div className="small">
                    Microsoft services are running normally. Last checked: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>

        {/* MSAL Account Information */}
        <Row>
          <Col>
            <AccountInformation />
          </Col>
        </Row>


      </Container>
    </div>
  )
}

export default Dashboard