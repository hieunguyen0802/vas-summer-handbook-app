import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';

function NavbarHeader() {
  const handleClick = () => {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("loginTime");
  }
  return (
    <>
      <Navbar bg="danger" variant="light" >
        <Container>
          <Navbar.Brand>
            <Nav.Link href="/"
              onClick={handleClick}
            ><span className="text-white">VAS | Summer Handbook </span></Nav.Link>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarHeader;
