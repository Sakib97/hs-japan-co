import styles from "../styles/NavigationBar.module.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import useScrollDirection from "../../hooks/useScrollDirection";

const NavigationBar = () => {
  // Offcanvas state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showNavbar = useScrollDirection();
  // see if mobile view
  const isMobile = window.innerWidth < 768;

  return (
    <div>
      {" "}
      <Navbar
        bg="light"
        expand="lg"
        // className="shadow-sm mb-3"
        className={`shadow-sm fixed-top py-1 ${
          showNavbar ? styles.navbarShow : styles.navbarHide
        }`}
      >
        <Container style={{ padding: "0px 10px", margin: "0 0 0 10vw" }}>
          <Navbar.Brand href="/">
            <img
              alt=""
              // src="/logo3.png"
              src="/logo_v1-.png"
              width={isMobile ? "45" : "45"}
              height={isMobile ? "50" : "50"}
              // className={styles.logo}
              // className="d-inline-block align-top"
            />
            &nbsp;
            <span>HS Japan Academy</span>
          </Navbar.Brand>

          <Navbar.Toggle
            onClick={handleShow}
            aria-controls="offcanvasNavbar-expand-lg"
          />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="start"
            show={show}
            onHide={handleClose}
            style={{ width: "70%" }}
          >
            <Offcanvas.Header
              closeButton
              onHide={handleClose}
              className="justify-content-center"
            >
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {/* <Offcanvas.Body  className={styles.offcanvasBody}> */}
              <Nav
                style={{ fontSize: "1.1rem" }}
                className="
                                    ms-auto        /* push to right on large screens */
                                    flex-lg-row    /* horizontal on large screens */
                                    flex-column    /* vertical on small screens */
                                    align-items-lg-end  /* right align on large */
                                    align-items-center  /* center align on small */
                                    gap-2
                                "
              >
                <Nav.Link onClick={handleClose} as={Link} to="/">
                  Home
                </Nav.Link>
                {/* <Nav.Link onClick={handleClose} href="#about">About</Nav.Link> */}
                <Nav.Link onClick={handleClose} as={Link} to="/contact">
                  Contact
                </Nav.Link>
                {/* {user ? (
                  <Nav.Link
                    onClick={handleClose}
                    as={Link}
                    to="/dashboard/profile"
                  >
                    {user.user_metadata.full_name || "User"}
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={handleClose} as={Link} to="/auth/signin">
                    Sign In
                  </Nav.Link>
                )} */}
                <Navbar.Text onClick={handleClose}>
                  {/* <LanguageToggle /> */}
                </Navbar.Text>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
