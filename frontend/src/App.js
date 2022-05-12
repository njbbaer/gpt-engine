import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {textarea: ''};
  }

  handleChangeTextarea = (event) => {
    this.setState({textarea: event.target.value});
  }

  render() {
    return (
      <div className="container d-grid gap-3 mt-3">
        <textarea
          className="form-control"
          rows="10"
          value={this.state.value}
          onChange={this.handleChangeTextarea}
        />
        <div className="d-flex gap-2 mb-3">
          <button id="generate-button" className="btn btn-lg btn-primary">Generate</button>
        </div>
      </div>
    );
  }
}

export default App;
