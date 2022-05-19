import "./App.css";

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import Alert from "./Alert";

import SelectTemplate from "./SelectTemplate";
import ConfigurationFields from "./ConfigurationFields";
import templates from "./templates";

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [textarea, setTextarea] = useState('');
  const [inputField, setInputField] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [showConfigurationFields, setShowConfigurationFields] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [configuration, setConfiguration] = useState({maxTokens: '', temperature: ''});

  function handleChangeApiKey(event) {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('apiKey', newApiKey);
  }

  function handleSelectTemplate(key, event) {
    const template = templates[key];
    setSelectedTemplate(event.target.text);
    setTextarea(template.prompt);
    setConfiguration({
      temperature: template.temperature,
      maxTokens: template.maxTokens,
    });
  }

  function handleGenerate() {
    const prompt = textarea + inputField;
    setTextarea(prompt);
    setInputField('');
    fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: parseInt(configuration.maxTokens),
        temperature: parseFloat(configuration.temperature),
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
      setTextarea(prompt + data.choices[0].text);
    })
    .catch(response => {
      response.json().then((json) => {
        setAlertText(json.error.message);
      })
      setTimeout(() => {
        setAlertText('');
      }, 5000);
    });
  }

  function handleChangeConfigurationField(event) {
    const newConfiguration = { ...configuration };
    newConfiguration[event.target.name] = event.target.value;
    setConfiguration(newConfiguration);
  }

  return (
    <div className="container">
      <Alert>{alertText}</Alert>
      <Form.Group className="mt-3">
        <Form.Label>API Key</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your OpenAI API key"
          data-lpignore="true"  // Disable LastPass
          onChange={handleChangeApiKey}
          value={apiKey}
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Label>Configuration</Form.Label>
        <div className="d-flex gap-2">
          <SelectTemplate
            selectedTemplate={selectedTemplate}
            handleSelectTemplate={handleSelectTemplate}
          />
          <Button
            id="expand-configuration-button"
            variant="outline-secondary"
            onClick={() => setShowConfigurationFields(!showConfigurationFields)}
          >
            {showConfigurationFields ? 'Hide' : 'Show'}
          </Button>
        </div>
      </Form.Group>
      <ConfigurationFields 
        showConfigurationFields={showConfigurationFields}
        handleChangeConfigurationField={handleChangeConfigurationField}
        configuration={configuration}
      />
      <Form.Group className="mt-3">
        <Form.Label>Prompt</Form.Label>
        <TextareaAutosize
          className="form-control"
          style={{ resize: "none" }}
          value={textarea}
          placeholder="Prompt body"
          onChange={(event) => setTextarea(event.target.value)}
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <TextareaAutosize
          className="form-control"
          style={{ resize: "none" }}
          value={inputField}
          placeholder="Input"
          onChange={(event) => setInputField(event.target.value)}
        />
      </Form.Group>
      <Button
        id="generate-button"
        variant="primary"
        size="lg"
        className="mt-3"
        onClick={handleGenerate}
      >Generate</Button>
    </div>
  );
}

export default App;
