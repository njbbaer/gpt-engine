import 'react-slidedown/lib/slidedown.css'

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { SlideDown } from "react-slidedown";

function SettingsPanel(props) {
  return (
    <SlideDown>
      { props.showSettingsPanel && 
        <Card>
          <Card.Body>
            <Form.Group>
              <Form.Label>Temperature</Form.Label>
              <Form.Control />
            </Form.Group>
          </Card.Body>
        </Card>
      }
    </SlideDown>
  );
}

export default SettingsPanel;