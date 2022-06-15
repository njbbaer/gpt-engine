import Dropdown from "react-bootstrap/Dropdown";

function SelectTemplate(props) {
  function dropwdown_items(type) {
    if (!props.templates) return [];
    return Object.keys(props.templates)
      .filter((key) => props.templates[key].type === type)
      .reverse()
      .map((key) => (
        <Dropdown.Item key={key} eventKey={key}>
          {props.templates[key].title}
        </Dropdown.Item>
      ));
  }

  return (
    <Dropdown
      onSelect={props.handleSelectTemplate}
      id="template-dropdown"
      style={props.style}
    >
      <Dropdown.Toggle variant="outline-secondary">
        {props.selectedTemplate
          ? props.getTemplate(props.selectedTemplate).title
          : "Select a template"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>Answer Question</Dropdown.Header>
        {dropwdown_items("answerQuestion")}
        <Dropdown.Header>Conversation</Dropdown.Header>
        {dropwdown_items("conversation")}
        <Dropdown.Header>Other</Dropdown.Header>
        {dropwdown_items("other")}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SelectTemplate;
