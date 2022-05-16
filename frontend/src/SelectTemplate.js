import Dropdown from "react-bootstrap/Dropdown";
import prompts from "./prompts";

function SelectTemplate(props) {
  return (
    <Dropdown onSelect={props.handleSelectTemplate}>
      <Dropdown.Toggle variant="outline-secondary" id="template-dropdown">
        {props.selectedTemplate || "Select a template"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.keys(prompts).map((key) => (
          <Dropdown.Item key={key} eventKey={key}>{prompts[key].title}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SelectTemplate;