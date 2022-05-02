function readFields() {
  const params = {
    'prompt': $('#inputPrompt').text(),
    'input': $('#inputInput').val(),
  };
  $('.paramField').each(function() {
    let value = $(this).find('input').val().replace('\\n', '\n');
    const field = param_fields.find(f => f.field_id === $(this).attr('id'));
    if (value) params[field.key] = value;
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
    inputElement.val(value?.replace('\n', '\\n') || '');
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
