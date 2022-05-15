import "./App.css";

import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import Alert from "./Alert";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: '',
      apiKey: localStorage.getItem('apiKey') || '',
    };
  }

  handleChangeTextarea = (event) => {
    this.setState({textarea: event.target.value});
  }

  handleChangeApiKey = (event) => {
    const apiKey = event.target.value;
    this.setState({apiKey: apiKey});
    localStorage.setItem('apiKey', apiKey);
  }

  handleSelectTemplate = (_, event) => {
    this.setState({selectedTemplate: event.target.text});
  }

  handleGenerate = () => {
    fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.apiKey}`,
      },
      body: JSON.stringify({
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
        this.setState({alertText: json.error.message});
      })
      setTimeout(() => {
        this.setState({alertText: ''});
      }, 5000);
    });
  }

  render() {
    return (
      <div className="container d-grid gap-3 mt-3">
        <Alert>{this.state.alertText}</Alert>
        <Form.Group>
          <Form.Label>API Key</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your OpenAI API key"
            data-lpignore="true"  // Disable LastPass
            onChange={this.handleChangeApiKey}
            value={this.state.apiKey}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Template</Form.Label>
          <Dropdown id="template-dropdown" onSelect={this.handleSelectTemplate}>
            <Dropdown.Toggle variant="outline-secondary" id="template-dropdown">
              {this.state.selectedTemplate || "Select a template"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Chat</Dropdown.Item>
              <Dropdown.Item>Stack Overflow</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <Form.Group>
          <Form.Label>Prompt</Form.Label>
          <TextareaAutosize
            className="form-control"
            style={{ resize: "none" }}
            value={this.state.textarea}
            onChange={this.handleChangeTextarea}
          />
        </Form.Group>
        <div className="d-flex gap-2 mb-3">
          <Button 
            id="generate-button"
            className="btn btn-lg btn-primary"
            onClick={this.handleGenerate}
          >Generate</Button>
        </div>
      </div>
    );
  }
}

export default App;
