import styles from "../styles/NavigationBar.module.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Collapse from "react-bootstrap/Collapse";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import useScrollDirection from "../../hooks/useScrollDirection";

const NavigationBar = () => {
  // Offcanvas state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Desktop Dropdown State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  const handleMouseEnter = (linkName) => {
    // Only switch if we are moving to a NEW dropdown
    // If we re-enter the already open/sticky one, don't change anything (keep it sticky if it was)
    if (activeDropdown !== linkName) {
      setActiveDropdown(linkName);
      setIsSticky(false);
    }
  };

  const handleMouseLeave = () => {
    // Only close if it's NOT sticky
    if (!isSticky) {
      setActiveDropdown(null);
    }
  };

  const handleToggle = (isOpen, meta, linkName) => {
    if (meta.source === "click") {
      // If clicking:
      // 1. If it's the one already open and sticky, toggle it CLOSED.
      // 2. Otherwise (different one, or same one but not sticky yet), make it OPEN and STICKY.
      if (activeDropdown === linkName && isSticky) {
        setActiveDropdown(null);
        setIsSticky(false);
      } else {
        setActiveDropdown(linkName);
        setIsSticky(true);
      }
    }
  };

  const closeDropdownCheck = () => {
    // Helper to close dropdown when clicking a link inside it
    setActiveDropdown(null);
    setIsSticky(false);
    handleClose(); // Close offcanvas if mobile
  };

  // Mobile Dropdown States
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [japanOpen, setJapanOpen] = useState(false);

  const showNavbar = useScrollDirection();
  // see if mobile view
  const isMobile = window.innerWidth < 768;

  const toggleAdmission = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdmissionOpen(!admissionOpen);
  };

  const toggleJapan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJapanOpen(!japanOpen);
  };

  return (
    <div>
      {" "}
      <Navbar
        variant="dark"
        expand="lg"
        // className="shadow-sm mb-3"
        className={`shadow-sm fixed-top py-1 ${
          showNavbar ? styles.navbarShow : styles.navbarHide
        }`}
        style={{ backgroundColor: "#2D2A4A" }}
      >
        <Container style={{ padding: "0px 10px", margin: "0 0 0 10vw" }}>
          <Navbar.Brand href="/">
            <img
              alt=""
              // src="/logo3.png"
              src="/logo_1.png"
              width={isMobile ? "200" : "300"}
              height={isMobile ? "50" : "80"}
              // className={styles.logo}
              // className="d-inline-block align-top"
            />
            &nbsp;
            {/* <span>HS Japan Academy</span> */}
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

              {/* Desktop Menu */}
              <Nav
                style={{ fontSize: "1.1rem" }}
                className="
                                    d-none d-lg-flex
                                    ms-auto        /* push to right on large screens */
                                    flex-lg-row    /* horizontal on large screens */
                                    flex-column    /* vertical on small screens */
                                    align-items-lg-center
                                    align-items-center  /* center align on small */
                                    gap-3
                                "
              >
                <Nav.Link onClick={handleClose} as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link onClick={handleClose} as={Link} to="/about">
                  About Us
                </Nav.Link>

                <NavDropdown
                  title="Admission"
                  id="admission-dropdown"
                  className={styles.hoverDropdown}
                  show={activeDropdown === "admission"}
                  onMouseEnter={() => handleMouseEnter("admission")}
                  onMouseLeave={handleMouseLeave}
                  onToggle={(isOpen, meta) =>
                    handleToggle(isOpen, meta, "admission")
                  }
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/admission"
                    onClick={closeDropdownCheck}
                  >
                    Admission
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admission/online"
                    onClick={closeDropdownCheck}
                  >
                    Online Admission
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown
                  title="Japan"
                  id="japan-dropdown"
                  className={styles.hoverDropdown}
                  show={activeDropdown === "japan"}
                  onMouseEnter={() => handleMouseEnter("japan")}
                  onMouseLeave={handleMouseLeave}
                  onToggle={(isOpen, meta) =>
                    handleToggle(isOpen, meta, "japan")
                  }
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/japan/culture"
                    onClick={closeDropdownCheck}
                  >
                    Culture
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/japan/guide"
                    onClick={closeDropdownCheck}
                  >
                    Guide
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link onClick={handleClose} as={Link} to="/gallery">
                  Gallery
                </Nav.Link>
                <Nav.Link onClick={handleClose} as={Link} to="/team">
                  Team
                </Nav.Link>

                <Nav.Link onClick={handleClose} as={Link} to="/contact">
                  Contact Us
                </Nav.Link>

                <Button
                  as={Link}
                  to="/auth/signin"
                  className={styles.loginBtn}
                  onClick={handleClose}
                >
                  <div className={styles.loginIcon}>
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span
                    style={{
                      borderLeft: "1px solid rgba(255,255,255,0.5)",
                      height: "20px",
                      margin: "0 5px",
                    }}
                  ></span>
                  Login
                </Button>
              </Nav>

              {/* Mobile Menu */}
              <div className="d-lg-none d-flex flex-column gap-0">
                <div className={styles.mobileMenuItem}>
                  <Link
                    to="/"
                    className={styles.mobileNavLink}
                    onClick={handleClose}
                  >
                    <i className="fa-solid fa-chevron-right"></i> Home
                  </Link>
                </div>
                <div className={styles.mobileMenuItem}>
                  <Link
                    to="/about"
                    className={styles.mobileNavLink}
                    onClick={handleClose}
                  >
                    <i className="fa-solid fa-chevron-right"></i> About Us
                  </Link>
                </div>

                {/* Admission Dropdown */}
                <div className={styles.mobileMenuItem}>
                  <div
                    className={`${styles.mobileDropdownHeader} ${
                      admissionOpen ? styles.active : ""
                    }`}
                    onClick={toggleAdmission}
                  >
                    <div className="d-flex align-items-center">
                      <i
                        className={`fa-solid ${
                          admissionOpen ? "fa-chevron-down" : "fa-chevron-right"
                        } me-2`}
                        style={{ fontSize: "12px", width: "15px" }}
                      ></i>
                      Admission
                    </div>
                    <button className={styles.mobileDropdownToggle}>
                      <i
                        className={`fa-solid ${
                          admissionOpen ? "fa-minus" : "fa-plus"
                        }`}
                      ></i>
                    </button>
                  </div>
                  <Collapse in={admissionOpen}>
                    <div className={styles.mobileSubMenu}>
                      <div
                        className={styles.mobileMenuItem}
                        style={{ borderBottom: "none" }}
                      >
                        <Link
                          to="/admission"
                          className={styles.mobileNavLink}
                          onClick={handleClose}
                        >
                          <i className="fa-solid fa-chevron-right"></i>{" "}
                          Admission
                        </Link>
                      </div>
                      <div
                        className={styles.mobileMenuItem}
                        style={{ borderBottom: "none" }}
                      >
                        <Link
                          to="/admission/online"
                          className={styles.mobileNavLink}
                          onClick={handleClose}
                        >
                          <i className="fa-solid fa-chevron-right"></i> Online
                          Admission
                        </Link>
                      </div>
                    </div>
                  </Collapse>
                </div>

                {/* Japan Dropdown */}
                <div className={styles.mobileMenuItem}>
                  <div
                    className={`${styles.mobileDropdownHeader} ${
                      japanOpen ? styles.active : ""
                    }`}
                    onClick={toggleJapan}
                  >
                    <div className="d-flex align-items-center">
                      <i
                        className={`fa-solid ${
                          japanOpen ? "fa-chevron-down" : "fa-chevron-right"
                        } me-2`}
                        style={{ fontSize: "12px", width: "15px" }}
                      ></i>
                      Japan
                    </div>
                    <button className={styles.mobileDropdownToggle}>
                      <i
                        className={`fa-solid ${
                          japanOpen ? "fa-minus" : "fa-plus"
                        }`}
                      ></i>
                    </button>
                  </div>
                  <Collapse in={japanOpen}>
                    <div className={styles.mobileSubMenu}>
                      <div
                        className={styles.mobileMenuItem}
                        style={{ borderBottom: "none" }}
                      >
                        <Link
                          to="/japan/culture"
                          className={styles.mobileNavLink}
                          onClick={handleClose}
                        >
                          <i className="fa-solid fa-chevron-right"></i> Culture
                        </Link>
                      </div>
                      <div
                        className={styles.mobileMenuItem}
                        style={{ borderBottom: "none" }}
                      >
                        <Link
                          to="/japan/guide"
                          className={styles.mobileNavLink}
                          onClick={handleClose}
                        >
                          <i className="fa-solid fa-chevron-right"></i> Guide
                        </Link>
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className={styles.mobileMenuItem}>
                  <Link
                    to="/gallery"
                    className={styles.mobileNavLink}
                    onClick={handleClose}
                  >
                    <i className="fa-solid fa-chevron-right"></i> Gallery
                  </Link>
                </div>
                <div className={styles.mobileMenuItem}>
                  <Link
                    to="/team"
                    className={styles.mobileNavLink}
                    onClick={handleClose}
                  >
                    <i className="fa-solid fa-chevron-right"></i> Team
                  </Link>
                </div>
                <div className={styles.mobileMenuItem}>
                  <Link
                    to="/contact"
                    className={styles.mobileNavLink}
                    onClick={handleClose}
                  >
                    <i className="fa-solid fa-chevron-right"></i> Contact Us
                  </Link>
                </div>

                <div className="mt-4">
                  <Button
                    as={Link}
                    to="/auth/signin"
                    className={styles.loginBtn}
                    onClick={handleClose}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <div className={styles.loginIcon}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <span
                      style={{
                        borderLeft: "1px solid rgba(255,255,255,0.5)",
                        height: "20px",
                        margin: "0 5px",
                      }}
                    ></span>
                    Login
                  </Button>
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
