import Nav from 'react-bootstrap/Nav';

import './App.css';

function App() {
  return (
    <Nav className="navbar navbar-light bg-light">
      <div className="container" style= {{ justifyContent: 'space-between' }}>
        <div className="navbar-brand">
          GPT Agent
        </div>
        <a href="https://github.com/njbbaer/gpt-agent">GitHub</a>
      </div>
    </Nav>
  );
}

export default App;
