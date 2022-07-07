import "./App.css";

import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import TextareaAutosize from "react-textarea-autosize";
import yaml from "js-yaml";
import { useHotkeys } from "react-hotkeys-hook";

import ConfigurationFields from "./ConfigurationFields";
import Alert from "./Alert";
import InputButtons from "./InputButtons";
import InfoBoxes from "./InfoBoxes";
import ConfigurationButtons from "./ConfigurationButtons";

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
  const [templates, setTemplates] = useState({});
  const [templatesUrl, setTemplateUrl] = useState(
    localStorage.getItem("templatesUrl") || ""
  );
  const [configuration, setConfiguration] = useState({
    maxTokens: "",
    temperature: "",
    inputPrefix: "",
    inputSuffix: "",
    stopSequences: "",
    stripNewlines: false,
  });

  useHotkeys(
    "ctrl+enter",
    () => {
      if (!isLoading) handleGenerate();
    },
    { enableOnTags: ["TEXTAREA"] },
    [textarea, inputField]
  );

  // Fetch templates from YAML file
  useEffect(() => {
    if (!templatesUrl) return;
    const templatesUrlAllOrigins = `https://api.allorigins.win/get?url=${encodeURIComponent(
      templatesUrl
    )}`;
    fetch(templatesUrlAllOrigins)
      .then((response) => response.json())
      .then((data) => {
        const loadedTemplates = yaml.load(data.contents);
        if (typeof loadedTemplates !== "object" || loadedTemplates == null)
          throw Error();
        setTemplates(loadedTemplates);
      })
      .catch(() => {
        setTemplates({});
      });
  }, [templatesUrl]);

  function isTemplatesValid() {
    return Object.keys(templates).length > 0;
  }

  function handleChangeTemplateUrl(event) {
    const newTemplateUrl = event.target.value;
    setTemplateUrl(newTemplateUrl);
    localStorage.setItem("templatesUrl", newTemplateUrl);
  }

  function handleChangeApiKey(event) {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
  }

  function getTemplate(key) {
    try {
      const template = templates.templates[key];
      const defaults = templates.defaults[template.type];
      return { ...defaults, ...template };
    } catch (e) {
      return null;
    }
  }

  function handleSelectTemplate(key) {
    const template = getTemplate(key);
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
          addCharsToSessionTotal(prompt.length);
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
      addCharsToSessionTotal(body.prompt.length);
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
        <Form.Label>Templates URL</Form.Label>
        <Form.Control
          placeholder="Enter a prompt templates URL"
          data-lpignore="true"
          onChange={handleChangeTemplateUrl}
          value={templatesUrl}
          isValid={isTemplatesValid()}
          isInvalid={!isTemplatesValid()}
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Label>Configuration</Form.Label>
        <ConfigurationButtons
          selectedTemplate={selectedTemplate}
          handleSelectTemplate={handleSelectTemplate}
          handleReset={handleReset}
          showConfigurationFields={showConfigurationFields}
          setShowConfigurationFields={setShowConfigurationFields}
          getTemplate={getTemplate}
          templates={templates.templates}
        />
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
