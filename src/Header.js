import Nav from "react-bootstrap/Nav";

function Header() {
  return (
    <Nav className="navbar navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">Language Agent</div>
        <a href="https://github.com/njbbaer/gpt-agent">GitHub</a>
      </div>
    </Nav>
  );
}

export default Header;
