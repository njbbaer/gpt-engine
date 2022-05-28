import Nav from "react-bootstrap/Nav";
import { ChatLeftText, Github, Lightbulb } from "react-bootstrap-icons";

function Header() {
  return (
    <Nav className="navbar navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <ChatLeftText size={24} /> Language Agent
        </div>
        <div>
          <a className="icon-link" href="https://github.com/njbbaer/gpt-agent">
            <Github size={24} />
          </a>
          <a className="icon-link" href="https://forms.gle/QAv5GyGmVUNyZndQ9">
            <Lightbulb size={24} />
          </a>
        </div>
      </div>
    </Nav>
  );
}

export default Header;
