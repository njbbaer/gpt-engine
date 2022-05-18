import "./App.css";

import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import Alert from "./Alert";

import SelectTemplate from "./SelectTemplate";
import ConfigurationPanel from "./ConfigurationPanel";
import prompts from "./prompts";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: '',
      apiKey: localStorage.getItem('apiKey') || '',
      showConfigurationPanel: false,
    };
  }

  handleChangeApiKey = (event) => {
    const apiKey = event.target.value;
    this.setState({apiKey: apiKey});
    localStorage.setItem('apiKey', apiKey);
  }

  handleSelectTemplate = (key, event) => {
    this.setState({
      selectedTemplate: event.target.text,
      textarea: prompts[key].prompt,
    });
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
        max_tokens: 128,
        frequency_penalty: 0.5,
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
      <div className="container">
        <Alert>{this.state.alertText}</Alert>
        <Form.Group className="mt-3">
          <Form.Label>API Key</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your OpenAI API key"
            data-lpignore="true"  // Disable LastPass
            onChange={this.handleChangeApiKey}
            value={this.state.apiKey}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Configuration</Form.Label>
          <div className="d-flex gap-2">
            <SelectTemplate
              selectedTemplate={this.state.selectedTemplate}
              handleSelectTemplate={this.handleSelectTemplate}
            />
            <Button
              id="expand-configuration-button"
              variant="outline-secondary"
              onClick={() => this.setState({showConfigurationPanel: !this.state.showConfigurationPanel})}
            >
              {this.state.showConfigurationPanel ? 'Hide' : 'Show'}
            </Button>
          </div>
        </Form.Group>
        <ConfigurationPanel showConfigurationPanel={this.state.showConfigurationPanel} />
        <Form.Group className="mt-3">
          <Form.Label>Prompt</Form.Label>
          <TextareaAutosize
            className="form-control"
            style={{ resize: "none" }}
            minRows="4"
            value={this.state.textarea}
            onChange={(event) => this.setState({textarea: event.target.value})}
          />
        </Form.Group>
        <Button
          id="generate-button"
          variant="primary"
          size="lg"
          className="mt-3"
          onClick={this.handleGenerate}
        >Generate</Button>
      </div>
    );
  }
}

export default App;
