import Button from "react-bootstrap/Button";
import {
  ArrowCounterclockwise,
  Send,
  SendExclamation,
} from "react-bootstrap-icons";

function InputButtons(props) {
  return (
    <>
      <div
        className="d-flex gap-2 mt-2 mb-2"
        style={{ justifyContent: "flex-end" }}
      >
        <Button
          variant="outline-primary"
          className="d-flex justify-content-center align-items-center"
          size="lg"
          onClick={props.handleUndo}
        >
          <ArrowCounterclockwise size={20} />
        </Button>
        <Button
          id="generate-button"
          variant="primary"
          className="d-flex justify-content-center align-items-center"
          disabled={props.isLoading}
          size="lg"
          onClick={props.handleGenerate}
        >
          {props.isLoading ? <SendExclamation size={20} /> : <Send size={20} />}
        </Button>
      </div>
    </>
  );
}

export default InputButtons;
