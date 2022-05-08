let lastPrompt = '';

// Submit an API request
$('#submitButton').click(() => {
  const request_body = getRequestBody();
  appendPrompt(getFieldValue('input_prefix'));
  appendPrompt($('#inputField').val());
  $('#inputField').val('');
  lastPrompt = request_body['prompt'];
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

$('#undoButton').click(() => {
  $('#promptField').text(lastPrompt);
});

// Toggle the visibility of a field
$('.toggleField').bind('click initialize', event => {
  const button = $(event.currentTarget);
  const paramField = $(`.paramField[name="${button.attr('name')}"]`);
  toggleField(button, paramField)
})

// Toggle the visibility of settings
$('#settingsButton').bind('click initialize', event => {
  toggleField($(event.currentTarget), $(`#settings`));
})

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
    'prompt': $('#promptField').text(),
    'max_tokens': parseInt(getFieldValue('max_tokens')),
    'temperature': parseFloat(getFieldValue('temperature')),
    'stop': (getFieldValue('stop') || null)?.split(','),
  };
  requestBody['prompt'] += getFieldValue('input_prefix') + $('#inputField').val() + getFieldValue('output_prefix');
  return requestBody
}

const appendPrompt = (text) => {
  $('#promptField').text($('#promptField').text() + text);
}

const getFieldValue = (key) => {
  if ($(`.toggleField[name=${key}]`).hasClass('active')) {
    return $(`.paramField[name=${key}]`).find('input').val().replace('\\n', '\n');
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
