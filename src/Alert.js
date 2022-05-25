import "react-slidedown/lib/slidedown.css";

import { SlideDown } from "react-slidedown";
import BootstrapAlert from "react-bootstrap/Alert";

function Alert(props) {
  return (
    <SlideDown>
      {props.children && (
        <>
          <BootstrapAlert variant="danger" className="mb-0" id="alert">
            {props.children}
          </BootstrapAlert>
          <div className="spacer"></div>
        </>
      )}
    </SlideDown>
  );
}

export default Alert;
