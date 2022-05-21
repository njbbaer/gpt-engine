import "react-slidedown/lib/slidedown.css";

import { SlideDown } from "react-slidedown";
import BootstrapAlert from "react-bootstrap/Alert";

function Alert(props) {
  return (
    <SlideDown>
      {props.children && (
        <>
          <div className="spacer"></div>
          <BootstrapAlert variant="danger" className="mb-0" id="alert">
            {props.children}
          </BootstrapAlert>
        </>
      )}
    </SlideDown>
  );
}

export default Alert;
