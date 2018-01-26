var unique = require('array-unique');

/**
 * Extracts the tokens from a template, including their default values, if
 * present.
 *
 * @param {String} template
 * @returns {Array}
 */
function extract(template, onlyUnique = true) {
  let re = /{{(.*?)}}/g;

  let matches = template.match(re);

  if (onlyUnique) {
    matches = unique(matches);
  };

  let tokens = [];

  matches.forEach(element => {
    let cleanElement = element.replace('{{', '').replace('}}', '');

    let key = undefined;
    let defaultValue = undefined;

    // Try to get the key and default value
    if (cleanElement.indexOf('|') > -1) {
      key = cleanElement.split('|')[0];
      defaultValue = cleanElement.split('|')[1];
    } else {
      key = cleanElement;
    }

    tokens.push({
      raw: element,
      key,
      defaultValue
    });
  });

  return tokens;
}

/**
 * Renders a template, provided with the text of the template and the tokens.
 *
 * @param {String} template
 * @param {any} tokens
 * @returns {String}
 */
function render(template, tokens) {
  // If tokens are null or undefined, set as an empty
  if (!tokens) {
    tokens = [];
  }

  // Get extracted tokens that need to be replaced
  let extracted = extract(template, false);

  extracted.forEach(token => {
    // Check to see if we have a value
    let value = tokens[token.key];

    // Try to trim it
    if (value) {
      value = value.trim();
    }

    // Determine what the replacement value is
    let replacement = undefined;

    if (value) {
      replacement = value;
    } else if (token.defaultValue !== undefined) {
      replacement = token.defaultValue;
    } else {
      replacement = '{{' + token.key + '}}';
    }

    // Do the replacement
    template = template.replace(token.raw, replacement);
  });

  return template;
}

module.exports = {
  extract,
  render
};
