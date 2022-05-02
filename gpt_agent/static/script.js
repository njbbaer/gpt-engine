function readFields() {
  const params = {
    'prompt': $('#inputPrompt').text(),
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
        const array = value.split(',');
        if (!array) {
          params[field.key] = array;
        }
        break;
    }
  });
  return params;
}

$('#buttonSubmit').click(() => {
  const params = readFields();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
});
