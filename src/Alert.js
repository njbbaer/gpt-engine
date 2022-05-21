import 'react-slidedown/lib/slidedown.css'

import { SlideDown } from "react-slidedown";
import BootstrapAlert from "react-bootstrap/Alert";

function Alert(props) {
  return (
    <SlideDown>
      { props.children && 
        <BootstrapAlert variant="danger" className="mb-0">{props.children}
      </BootstrapAlert> }
    </SlideDown>
  );
}

export default Alert;