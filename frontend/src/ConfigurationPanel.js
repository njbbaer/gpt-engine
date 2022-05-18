import 'react-slidedown/lib/slidedown.css'

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { SlideDown } from "react-slidedown";

function ConfigurationPanel(props) {
  return (
    <SlideDown>
      { props.showConfigurationPanel &&
        <>
          <div className="spacer"></div>
          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label>Temperature</Form.Label>
                <Form.Control 
                  name="temperature"
                  data-lpignore="true"
                  onChange={props.handleChangeTemperature}
                  value={props.temperature}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </>
      }
    </SlideDown>
  );
}

export default ConfigurationPanel;