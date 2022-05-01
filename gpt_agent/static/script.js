function readFields() {
  const params = {
    'prompt': $('#inputPrompt').val(),
    'input': $('#inputInput').val(),
  };
  $('.inputField').each(function() {
    const value = $(this).find('input').val();
    const field = input_fields.find(f => f.key === $(this).attr('name'));
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
