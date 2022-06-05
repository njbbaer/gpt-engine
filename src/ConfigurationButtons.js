import Button from "react-bootstrap/Button";
import { Plus, Dash, ArrowRepeat } from "react-bootstrap-icons";

import SelectTemplate from "./SelectTemplate";

function ConfigurationButtons(props) {
  return (
    <div className="d-flex gap-2">
      <SelectTemplate
        selectedTemplate={props.selectedTemplate}
        handleSelectTemplate={props.handleSelectTemplate}
      />
      <Button
        variant="outline-secondary"
        className="d-flex align-items-center"
        onClick={() => props.handleReset()}
      >
        <ArrowRepeat size={18} />
      </Button>
      <Button
        variant="outline-secondary"
        className="d-flex align-items-center"
        onClick={() =>
          props.setShowConfigurationFields(!props.showConfigurationFields)
        }
      >
        {props.showConfigurationFields ? (
          <Dash size={18} />
        ) : (
          <Plus size={18} />
        )}
      </Button>
    </div>
  );
}

export default ConfigurationButtons;
