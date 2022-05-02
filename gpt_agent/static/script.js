function readFields() {
  const params = {
    'prompt': $('#inputPrompt').text(),
    'input': $('#inputInput').val(),
  };
  $('.paramField').each(function() {
    const value = $(this).find('input').val();
    const field = param_fields.find(f => f.field_id === $(this).attr('id'));
    switch (field.type) {
      case 'string':
        params[field.key] = value;
        break;
      case 'float':
        params[field.key] = parseFloat(value);
        break;
      case 'array':
        const array = value.split(',');
        if (array[0] !== '') {
          params[field.key] = array;
        }
        break;
    }
  });
  return params;
}

function writeFields(params) {
  $('#inputPrompt').text(params.prompt);
  $('#inputInput').val(params.input);
  $('.paramField').each(function() {
    const field = param_fields.find(f => f.field_id === $(this).attr('id'));
    const value = params[field.key];
    const inputElement = $(this).find('input')
    if (value) {
      switch (field.type) {
        case 'string':
        case 'float':
          inputElement.val(value);
          break;
        case 'array':
          inputElement.val(value.join(','));
          break;
      }
    } else {
      inputElement.val('');
    }
  });
}

$('#buttonSubmit').click(() => {
  const params = readFields();
  console.log('Request:', params);
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response:', data);
    writeFields(data);
  })
});
