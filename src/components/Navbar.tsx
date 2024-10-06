import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { usePermissions } from "../util/usePermissions";

const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Security App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/venues">
              Venues
            </Nav.Link>
            <Nav.Link as={Link} to="/contacts">
              Contacts
            </Nav.Link>
            <Nav.Link as={Link} to="/offenders">
              Offenders
            </Nav.Link>
            <Nav.Link as={Link} to="/incidents">
              Incidents
            </Nav.Link>
            <Nav.Link as={Link} to="/warnings">
              Warnings
            </Nav.Link>
            <Nav.Link as={Link} to="/bans">
              Bans
            </Nav.Link>
            {hasPermission("MANAGE_USERS") && (
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/reporting">
              Reporting
            </Nav.Link>
            
          </Nav>
          {user && (
            <Nav>
              <NavDropdown
                title={`Signed in as: ${user.email}`}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/account">
                  Account
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
