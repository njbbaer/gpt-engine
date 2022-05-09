let lastPrompt = '';
let lastInput = '';

// Submit an API request
$('#submit-button').click(() => {
  lastPrompt = $('#prompt-field').text();
  lastInput = $('#input-field').val();
  const request_body = getRequestBody();
  appendPrompt(getFieldValue('input_prefix'));
  appendPrompt($('#input-field').val());
  $('#input-field').val('');
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request_body),
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    appendPrompt(getFieldValue('output_prefix'));
    appendPrompt(data.choices[0].text);
  })
  .catch(response => {
    response.json().then((json) => {
      flashError(json['error']);
    })
  });
});

// Undo the response from the last API request
$('#undo-button').click(() => {
  $('#prompt-field').text(lastPrompt);
  $('#input-field').val(lastInput);
});

// Toggle the visibility of a field
$('.toggle-field').bind('click', event => {
  const button = $(event.currentTarget);
  const paramField = $(`.param-field[name="${button.attr('name')}"]`);
  updateToggledField(button, paramField)
})

// Toggle the visibility of modify
$('#modify-button').bind('click', event => {
  updateToggledField($(event.currentTarget), $(`#modify`));
})

// Set the current template
$('#template-select a').click(event => {
  const selectedTemplate = $(event.currentTarget).text();
  $('#template-button').text(selectedTemplate);
  applyTemplate(selectedTemplate)
});


const flashError = (message) => {
  const alert = $('.alert');
  alert.text(message);
  alert.slideDown(() => {
    setTimeout(() => alert.slideUp(), 5000);
  });
}

const getRequestBody = () => {
  const requestBody = {
    'engine': getFieldValue('engine') || 'text-davinci-002',
    'prompt': $('#prompt-field').text(),
    'max_tokens': parseInt(getFieldValue('max_tokens')),
    'temperature': parseFloat(getFieldValue('temperature')),
    'stop': (getFieldValue('stop') || null)?.split(','),
  };
  requestBody['prompt'] += getFieldValue('input_prefix') + $('#input-field').val() + getFieldValue('output_prefix');
  return requestBody
}

const appendPrompt = (text) => {
  $('#prompt-field').text($('#prompt-field').text() + text);
}

const getFieldValue = (key) => {
  if ($(`.toggle-field[name=${key}]`).hasClass('active')) {
    return $(`.param-field[name=${key}]`).find('input').val().replace('\\n', '\n');
  } else {
    return '';
  }
}

const updateToggledField = (button, field) => {
  if (button.hasClass('active')) {
    button.addClass('bg-secondary text-white border-white');
    button.removeClass('bg-white text-secondary border-secondary');
    field.slideDown();
  } else {
    button.addClass('bg-white text-secondary border-secondary');
    button.removeClass('bg-secondary text-white border-white');
    field.slideUp();
  }
}

const applyTemplate = (name) => {
  const template = templates[name];
  $('#prompt-field').text(template.prompt);
  $('#input-field').val(template.input);
  paramFields.forEach(field => {
    const value = template[field.key];
    const toggleField = $(`.toggle-field[name=${field.key}]`);
    const paramField = $(`.param-field[name=${field.key}]`);
    paramField.find('input').val(value);
    if (value) {
      toggleField.addClass('active')
    } else {
      toggleField.removeClass('active')
    }
    updateToggledField(toggleField, paramField);
  });
}
