function readFields() {
  const params = {
    'prompt': $('#inputPrompt').val(),
    'input': $('#inputInput').val(),
  };
  input_fields.forEach(field => {
    const value = $(`#${field.input_id}`).val();
    switch (field.type) {
      case 'string':
        params[field.key] = value;
        break;
      case 'float':
        params[field.key] = parseFloat(value);
        break;
      case 'array':
        params[field.key] = value.split(',');
        break;
    }
  });
  return params;
}

$('#buttonSubmit').click(() => {
  const params = readFields();
  console.log(params);
});
