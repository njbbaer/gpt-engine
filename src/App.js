import "./App.css";

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import Alert from "./Alert";
import { ArrowRepeat, Plus, Dash } from "react-bootstrap-icons";

import SelectTemplate from "./SelectTemplate";
import ConfigurationFields from "./ConfigurationFields";
import templates from "./templates";

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [textarea, setTextarea] = useState("");
  const [inputField, setInputField] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [showConfigurationFields, setShowConfigurationFields] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [undoState, setUndoState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState({
    maxTokens: "",
    temperature: "",
    inputPrefix: "",
    inputSuffix: "",
    stopSequences: "",
    stripNewlines: false,
  });

  function handleChangeApiKey(event) {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
  }

  function handleSelectTemplate(key, event) {
    const template = templates[key];
    setSelectedTemplate(event.target.text);
    setTextarea(template.prompt);
    setConfiguration({
      temperature: template.temperature || "",
      maxTokens: template.maxTokens || "",
      inputPrefix: template.inputPrefix || "",
      inputSuffix: template.inputSuffix || "",
      stopSequences: template.stopSequences || "",
      stripNewlines: template.stripNewlines || false,
    });
  }

  function handleGenerate() {
    setIsLoading(true);
    let temp_textarea = textarea;
    if (inputField.length > 0)
      temp_textarea += configuration.inputPrefix + inputField;
    let prompt = temp_textarea;
    if (inputField.length > 0) prompt += configuration.inputSuffix;
    const stopSequences = configuration.stopSequences
      .split(", ")
      .filter((s) => s !== "");
    setUndoState({
      texarea: textarea,
      inputField: inputField,
    });
    setTextarea(temp_textarea);
    setInputField("");
    fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: parseInt(configuration.maxTokens),
        temperature: parseFloat(configuration.temperature),
        stop: stopSequences.length !== 0 ? stopSequences : null,
        frequency_penalty: 0.5,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((data) => {
        let output = data.choices[0].text;
        if (configuration.stripNewlines) {
          output = output.replace(/\n/g, " ");
        }
        setTextarea(prompt + output);
        setIsLoading(false);
      })
      .catch((response) => {
        response.json().then((json) => {
          setAlertText(json.error.message);
          setIsLoading(false);
        });
        setTimeout(() => {
          setAlertText("");
        }, 5000);
      });
  }

  function handleChangeConfigurationField(event) {
    const newConfiguration = { ...configuration };
    newConfiguration[event.target.name] = event.target.value.replace(
      /\\n/g,
      "\n"
    );
    setConfiguration(newConfiguration);
  }

  function handleChangeConfigurationBoolean(event) {
    const newConfiguration = { ...configuration };
    newConfiguration[event.target.name] = event.target.checked;
    setConfiguration(newConfiguration);
  }

  function handleUndo() {
    setTextarea(undoState.texarea);
    setInputField(undoState.inputField);
  }

  return (
    <div className="container">
      <Form.Group className="mt-3">
        <Form.Label>API Key</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your OpenAI API key"
          data-lpignore="true"
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
            variant="outline-secondary"
            className="d-flex justify-content-center align-items-center"
            onClick={() => setShowConfigurationFields(!showConfigurationFields)}
          >
            {showConfigurationFields ? <Dash size={18} /> : <Plus size={18} />}
          </Button>
        </div>
      </Form.Group>
      <ConfigurationFields
        showConfigurationFields={showConfigurationFields}
        handleChangeConfigurationField={handleChangeConfigurationField}
        handleChangeConfigurationBoolean={handleChangeConfigurationBoolean}
        configuration={configuration}
      />
      <Form.Group className="mt-3">
        <Form.Label>Prompt</Form.Label>
        <TextareaAutosize
          className="form-control"
          value={textarea}
          placeholder="Prompt body"
          onChange={(event) => setTextarea(event.target.value)}
        />
      </Form.Group>
      <Alert>{alertText}</Alert>
      <Form.Group className="mt-3">
        <TextareaAutosize
          className="form-control"
          value={inputField}
          placeholder="Input"
          onChange={(event) => setInputField(event.target.value)}
        />
      </Form.Group>
      <div className="d-flex gap-2 mt-3 mb-3">
        <Button
          id="generate-button"
          variant="primary"
          size="lg"
          className="d-flex justify-content-center align-items-center"
          disabled={isLoading}
          onClick={handleGenerate}
        >
          {isLoading ? <ArrowRepeat size={28} /> : "Generate"}
        </Button>
        <Button variant="outline-primary" size="lg" onClick={handleUndo}>
          Undo
        </Button>
      </div>
    </div>
  );
}

export default App;
