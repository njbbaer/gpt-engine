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

$('#undo-button').click(() => {
  $('#prompt-field').text(lastPrompt);
  $('#input-field').val(lastInput);
});

// Toggle the visibility of a field
$('.toggle-field').bind('click initialize', event => {
  const button = $(event.currentTarget);
  const paramField = $(`.param-field[name="${button.attr('name')}"]`);
  toggleField(button, paramField)
})

// Toggle the visibility of settings
$('#settings-button').bind('click initialize', event => {
  toggleField($(event.currentTarget), $(`#settings`));
})

// Set the current template
$('#template-select a').click(event => {
  console.log('test')
  const selectedTemplate = $(event.currentTarget).text();
  $('#template-button').text(selectedTemplate);
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

const toggleField = (button, field) => {
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
