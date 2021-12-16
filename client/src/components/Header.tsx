import { Navbar, Container, Nav } from "react-bootstrap";

const Header = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="xl" collapseOnSelect>
        <Container>
          <Navbar.Brand>New Game</Navbar.Brand>
          {/* <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
