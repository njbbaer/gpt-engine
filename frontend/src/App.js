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

  handleGenerate = () => {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        engine: 'text-davinci-002',
        prompt: this.state.textarea,
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(data => {
      const new_textarea = this.state.textarea + data.choices[0].text
      this.setState({textarea: new_textarea});
    })
    .catch(response => {
      response.json().then((json) => {
        console.error(json['error']);
      })
    });
  }

  render() {
    return (
      <div className="container d-grid gap-3 mt-3">
        <textarea
          className="form-control"
          rows="10"
          value={this.state.textarea}
          onChange={this.handleChangeTextarea}
        />
        <div className="d-flex gap-2 mb-3">
          <button 
            id="generate-button"
            className="btn btn-lg btn-primary"
            onClick={this.handleGenerate}
          >Generate</button>
        </div>
      </div>
    );
  }
}

export default App;
