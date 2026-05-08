/**
 * Profile Page Component
 * 
 * This is a protected page that displays detailed user profile information
 * obtained from Microsoft Graph API. It includes:
 * 
 * 1. User's profile picture (if available)
 * 2. Detailed account information
 * 3. Contact information
 * 4. Account settings and preferences
 * 5. Privacy and security settings
 * 
 * The component demonstrates how to make authenticated API calls to Microsoft Graph
 * to retrieve user data beyond basic authentication information.
 */

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Image, Badge, ListGroup, Tab, Tabs } from 'react-bootstrap'
import { useMsal } from '@azure/msal-react'; 
import { loginRequest, graphConfig } from '../lib/msalConfig'; 
import { useAuth } from '../hooks/useAuth';

/**
 * Profile component for displaying detailed user information
 */
function Profile() {
  // Get MSAL instance and accounts
  const { instance, accounts, activeAccount } = useAuth()
  
  // State for profile data and API responses
  const [profileData, setProfileData] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  /**
   * Function to acquire access token for Microsoft Graph API
   */
  const getAccessToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      })
      return response.accessToken
    } catch (error) {
      console.error('Error acquiring access token:', error)
      throw error
    }
  }

  /**
   * Function to fetch user profile data from Microsoft Graph
   */
  const fetchUserProfile = async () => {
    try {
      const accessToken = await getAccessToken()
      
      // Fetch user profile information
      const response = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProfileData(data)
      
      // Try to fetch profile photo
      try {
        const photoResponse = await fetch(graphConfig.graphUserPhotoEndpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (photoResponse.ok) {
          const photoBlob = await photoResponse.blob()
          const photoUrl = URL.createObjectURL(photoBlob)
          setProfilePhoto(photoUrl)
        }
      } catch (photoError) {
        console.log('Profile photo not available:', photoError)
        // This is okay - not all users have profile photos
      }

    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load profile data from Microsoft Graph')
    }
  }

  /**
   * Effect to load user profile when component mounts
   */
  useEffect(() => {
    const loadProfile = async () => {
      if (!activeAccount) {
        setError('No active account found')
        setIsLoading(false)
        return
      }

      await fetchUserProfile()
      setIsLoading(false)
    }

    loadProfile()
  }, [instance, activeAccount])

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    logout()
  }

  /**
   * Handle profile refresh
   */
  const handleRefresh = () => {
    setIsLoading(true)
    setError(null)
    fetchUserProfile().finally(() => setIsLoading(false))
  }

  // Loading state
  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading profile...</span>
          </div>
          <p className="mt-3">Loading your profile information...</p>
        </div>
      </Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Profile</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={handleRefresh}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container className="py-5">
          <Row className="align-items-center text-white">
            <Col xs="auto">
              {/* Profile Picture */}
              <div className="position-relative">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt="Profile"
                    roundedCircle
                    width={120}
                    height={120}
                    className="border border-3 border-white shadow"
                  />
                ) : (
                  <div 
                    className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center border border-3 border-white shadow"
                    style={{ width: 120, height: 120 }}
                  >
                    <i className="bi bi-person-fill" style={{ fontSize: '3rem' }}></i>
                  </div>
                )}
                <Badge 
                  bg="success" 
                  className="position-absolute bottom-0 end-0 rounded-circle p-2"
                  style={{ transform: 'translate(25%, 25%)' }}
                >
                  <i className="bi bi-check-lg"></i>
                </Badge>
              </div>
            </Col>
            <Col>
              <h1 className="h2 mb-2">
                {profileData?.displayName || activeAccount?.name || 'User Profile'}
              </h1>
              <p className="mb-2 opacity-75">
                <i className="bi bi-envelope me-2"></i>
                {profileData?.mail || profileData?.userPrincipalName || activeAccount?.username}
              </p>
              {profileData?.jobTitle && (
                <p className="mb-2 opacity-75">
                  <i className="bi bi-briefcase me-2"></i>
                  {profileData.jobTitle}
                </p>
              )}
              {profileData?.department && (
                <p className="mb-0 opacity-75">
                  <i className="bi bi-building me-2"></i>
                  {profileData.department}
                </p>
              )}
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button variant="outline-light" onClick={handleRefresh}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </Button>
                <Button variant="light" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Profile Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          {/* Overview Tab */}
          <Tab eventKey="overview" title={<><i className="bi bi-person me-2"></i>Overview</>}>
            <Row className="g-4">
              {/* Basic Information Card */}
              <Col md={6}>
                <Card className="h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Basic Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0">
                        <strong>Display Name:</strong>
                        <div className="text-muted">{profileData?.displayName || 'Not available'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Given Name:</strong>
                        <div className="text-muted">{profileData?.givenName || 'Not available'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Surname:</strong>
                        <div className="text-muted">{profileData?.surname || 'Not available'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>User Principal Name:</strong>
                        <div className="text-muted font-monospace small">
                          {profileData?.userPrincipalName || 'Not available'}
                        </div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>User ID:</strong>
                        <div className="text-muted font-monospace small">
                          {profileData?.id || activeAccount?.localAccountId || 'Not available'}
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Work Information Card */}
              <Col md={6}>
                <Card className="h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-briefcase me-2"></i>
                      Work Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0">
                        <strong>Job Title:</strong>
                        <div className="text-muted">{profileData?.jobTitle || 'Not specified'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Department:</strong>
                        <div className="text-muted">{profileData?.department || 'Not specified'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Office Location:</strong>
                        <div className="text-muted">{profileData?.officeLocation || 'Not specified'}</div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Business Phone:</strong>
                        <div className="text-muted">
                          {profileData?.businessPhones?.length > 0 ? profileData.businessPhones[0] : 'Not specified'}
                        </div>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="px-0">
                        <strong>Mobile Phone:</strong>
                        <div className="text-muted">{profileData?.mobilePhone || 'Not specified'}</div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Account Details Tab */}
          <Tab eventKey="account" title={<><i className="bi bi-gear me-2"></i>Account Details</>}>
            <Row className="g-4">
              {/* Account Status Card */}
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-shield-check me-2"></i>
                      Account Status
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Account Status:</strong>
                      <div>
                        <Badge bg="success" className="ms-2">
                          <i className="bi bi-check-circle me-1"></i>
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Account Type:</strong>
                      <div className="text-muted">Microsoft Account</div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Account Enabled:</strong>
                      <div>
                        <Badge bg={profileData?.accountEnabled ? 'success' : 'danger'}>
                          {profileData?.accountEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Preferred Language:</strong>
                      <div className="text-muted">{profileData?.preferredLanguage || 'Not set'}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Security Information Card */}
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-lock me-2"></i>
                      Security Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Tenant ID:</strong>
                      <div className="text-muted font-monospace small">
                        {activeAccount?.tenantId || 'Not available'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Home Account ID:</strong>
                      <div className="text-muted font-monospace small">
                        {activeAccount?.homeAccountId || 'Not available'}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Environment:</strong>
                      <div className="text-muted">{activeAccount?.environment || 'Not available'}</div>
                    </div>
                    
                    <div className="mb-0">
                      <strong>Last Authentication:</strong>
                      <div className="text-muted">{new Date().toLocaleString()}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Raw Data Tab (for developers) */}
          <Tab eventKey="data" title={<><i className="bi bi-code-square me-2"></i>Raw Data</>}>
            <Alert variant="info">
              <Alert.Heading>
                <i className="bi bi-info-circle me-2"></i>
                Developer Information
              </Alert.Heading>
              <p>
                This tab shows the raw data returned from Microsoft Graph API and MSAL. 
                This is useful for developers to understand what information is available.
              </p>
            </Alert>
            
            <Row className="g-4">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Microsoft Graph Profile Data</h5>
                  </Card.Header>
                  <Card.Body>
                    <pre className="bg-light p-3 rounded small" style={{ maxHeight: '400px', overflow: 'auto' }}>
                      {JSON.stringify(profileData, null, 2)}
                    </pre>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">MSAL Account Data</h5>
                  </Card.Header>
                  <Card.Body>
                    <pre className="bg-light p-3 rounded small" style={{ maxHeight: '400px', overflow: 'auto' }}>
                      {JSON.stringify(activeAccount, null, 2)}
                    </pre>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  )
}

export default Profile