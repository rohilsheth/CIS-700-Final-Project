import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from './climate-change-icon.png';
import 'bootstrap/dist/css/bootstrap.min.css'

function MenuBar() {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="justify-content-center">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Excelsior Climate
          </Navbar.Brand>
        </Container>
      </Navbar>
      
    </>
  );
}

export default MenuBar;