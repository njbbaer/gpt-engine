function InfoBoxes(props) {
  function cost() {
    return ((props.totalChars / 4 / 1024) * 0.06).toFixed(2);
  }

  function tokens() {
    return Math.round(props.chars / 4);
  }

  return (
    <div className="d-flex gap-2 mt-2" style={{ justifyContent: "flex-end" }}>
      <div className="info-box card text-muted">${cost()} spent</div>
      <div className="info-box card text-muted">{tokens()} tokens</div>
    </div>
  );
}

export default InfoBoxes;
