const INPUT_FIELDS = [
  {
    key: 'temperature',
    label: 'Temperature',
    inputId: 'inputTemperature',
    type: 'float',
  },
  {
    key: 'stop_text',
    inputId: 'inputStopText',
    label: 'Stop Text',
    type: 'array',
  },
  {
    key: 'input_prefix',
    label: 'Input Prefix',
    inputId: 'inputInputPrefix',
    type: 'string',
  },
  {
    key: 'output_prefix',
    label: 'Output Prefix',
    inputId: 'inputOutputPrefix',
    type: 'string',
  },
  {
    key: 'blind_prompt',
    label: 'Blind Prompt',
    inputId: 'inputBlindPrompt',
    type: 'string',
  },
];

function readFields() {
  const params = {
    'prompt': $('#inputPrompt').val(),
    'input': $('#inputInput').val(),
  };
  INPUT_FIELDS.forEach(field => {
    const value = $(`#${field.inputId}`).val();
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
