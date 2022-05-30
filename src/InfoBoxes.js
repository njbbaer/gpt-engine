import Badge from "react-bootstrap/Badge";

function InfoBoxes(props) {
  function cost() {
    return (
      ((props.textarea.length + props.inputField.length) / 4 / 1024) *
      0.06
    ).toFixed(2);
  }

  function tokens() {
    return Math.round((props.textarea.length + props.inputField.length) / 4);
  }

  return (
    <div className="d-flex gap-2 mt-2" style={{ justifyContent: "flex-end" }}>
      <div className="info-box card text-muted">${cost()} per send</div>
      <div className="info-box card text-muted">{tokens()} tokens</div>
    </div>
  );
}

export default InfoBoxes;
