import Nav from "react-bootstrap/Nav";
import { ChatLeftText, Github } from "react-bootstrap-icons";

function Header() {
  return (
    <Nav className="navbar navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <ChatLeftText /> Language Agent
        </div>
        <a class="icon-link" href="https://github.com/njbbaer/gpt-agent">
          <Github size={20} />
        </a>
      </div>
    </Nav>
  );
}

export default Header;
