import "./App.css";

import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import { Plus, Dash, ArrowRepeat } from "react-bootstrap-icons";

import templates from "./templates";
import SelectTemplate from "./SelectTemplate";
import ConfigurationFields from "./ConfigurationFields";
import Alert from "./Alert";
import InputButtons from "./InputButtons";
import InfoBoxes from "./InfoBoxes";

function App() {
  const abortController = useRef(new AbortController());
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [textarea, setTextarea] = useState("");
  const [inputField, setInputField] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [showConfigurationFields, setShowConfigurationFields] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [undoState, setUndoState] = useState({ textarea: "", inputField: "" });
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

  function handleSelectTemplate(key) {
    const template = templates[key];
    if (!template) return;
    setSelectedTemplate(key);
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

  async function handleGenerate() {
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
    addCharsToSessionTotal(prompt.length);
    setTextarea(temp_textarea);
    setInputField("");
    performCompletion({
      prompt: prompt,
      max_tokens: parseInt(configuration.maxTokens),
      temperature: parseFloat(configuration.temperature),
      stop: stopSequences.length !== 0 ? stopSequences : null,
      frequency_penalty: 0.5,
    })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function performCompletion(body) {
    const response = await fetchCompletion(body);
    const data = await response.json();
    if (response.ok) {
      let output = data.choices[0].text;
      if (configuration.stripNewlines) {
        output = output.replace(/\n/g, " ");
      }
      setTextarea(body.prompt + output);
    } else {
      setAlertText(data.error.message);
      setTimeout(() => {
        setAlertText("");
      }, 5000);
    }
  }

  function fetchCompletion(body) {
    abortController.current = new AbortController();
    return fetch(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: abortController.current.signal,
      }
    );
  }

  function addCharsToSessionTotal(length) {
    let totalChars = Number(sessionStorage.getItem("total-chars")) || 0;
    totalChars += length;
    sessionStorage.setItem("total-chars", totalChars);
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
    abortController.current.abort();
    setTextarea(undoState.texarea);
    setInputField(undoState.inputField);
  }

  function handleReset() {
    abortController.current.abort();
    handleSelectTemplate(selectedTemplate);
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
            style={{ minWidth: 0 }}
          />
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center"
            onClick={() => handleReset()}
          >
            <ArrowRepeat size={18} />
          </Button>
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center"
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
          minRows={2}
          value={textarea}
          onChange={(event) => setTextarea(event.target.value)}
        />
      </Form.Group>
      <hr />
      <Alert>{alertText}</Alert>
      <TextareaAutosize
        className="form-control"
        value={inputField}
        onChange={(event) => setInputField(event.target.value)}
      />
      <InfoBoxes
        chars={textarea.length + inputField.length}
        totalChars={Number(sessionStorage.getItem("total-chars"))}
      />
      <InputButtons
        handleGenerate={handleGenerate}
        handleUndo={handleUndo}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
