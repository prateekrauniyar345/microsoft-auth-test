/**
 * Navigation Component
 * 
 * This component provides the main navigation bar for the application.
 * It dynamically shows different menu items based on whether the user
 * is authenticated or not.
 * 
 * Features:
 * - Responsive Bootstrap navbar
 * - Authentication-aware menu items
 * - Sign in/sign out functionality
 * - Active page highlighting
 * - User avatar and name display when authenticated
 */

import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

/**
 * Navigation component
 */
function Navigation() {
  // Get authentication state and MSAL instance
  const { isAuthenticated, instance, accounts, inProgress, activeAccount, canInteract, login, logout } = useAuth()
  

  /**
   * Handle user sign-in
   */
  const handleLogin = async () => {
    if (inProgress !== 'none') {
      console.warn('Authentication interaction already in progress:', inProgress)
      return
    }
    try {
      await login()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  /**
   * Handle user sign-out
   */
  const handleLogout = () => {
    logout()
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        {/* Brand/Logo */}
        <Navbar.Brand href="/" className="fw-bold text-primary">
          <i className="bi bi-shield-lock me-2"></i>
          MS Auth Demo
        </Navbar.Brand>

        {/* Mobile menu toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left side navigation */}
          <Nav className="me-auto">
            <Nav.Link href="/">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>


            {/* Testing the backend */}
            <Nav.Link href="/backend">
              <i className="bi bi-server me-1"></i>
              Backend
            </Nav.Link>
            
            {/* Show authenticated navigation items */}
            {/* {isAuthenticated && (
              <>
                <Nav.Link href="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
                <Nav.Link href="/profile">
                  <i className="bi bi-person me-1"></i>
                  Profile
                </Nav.Link>
              </>
            )} */}
          </Nav>

          {/* Right side navigation */}
          <Nav>
            {isAuthenticated ? (
              <>
                {/* User dropdown menu */}
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {activeAccount?.name || 'User'}
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    <div className="small text-muted">Signed in as</div>
                    <div className="fw-bold">{activeAccount?.name}</div>
                    <div className="small text-muted">{activeAccount?.username}</div>
                  </NavDropdown.Header>
                  
                  <NavDropdown.Divider />
                  
                  {/* <NavDropdown.Item href="/profile">
                    <i className="bi bi-person-gear me-2"></i>
                    Profile Settings
                  </NavDropdown.Item> */}
                  
                  <NavDropdown.Item href="/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              /* Show sign-in button for unauthenticated users */
              <Button 
                variant="primary" 
                onClick={handleLogin}
                className="ms-2"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation