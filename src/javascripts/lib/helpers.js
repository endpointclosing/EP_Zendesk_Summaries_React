/**
 * Resize App container
 * @param {ZAFClient} client ZAFClient object
 * @param {Number} max max height available to resize to
 * @return {Promise} will resolved after resize
 */
export function resizeContainer (client, max = Number.POSITIVE_INFINITY) {
  const newHeight = Math.min(document.body.clientHeight, max)
  return client.invoke('resize', { height: newHeight })
}

/**
 * Helper to render a dataset using the same template function
 * @param {Array} set dataset
 * @param {Function} getTemplate function to generate template
 * @param {String} initialValue any template string prepended
 * @return {String} final template
 */
export function templatingLoop (set, getTemplate, initialValue = '') {
  return set.reduce((accumulator, item, index) => {
    return `${accumulator}${getTemplate(item, index)}`
  }, initialValue)
}

/**
 * Render template
 * @param {String} replacedNodeSelector selector of the node to be replaced
 * @param {String} htmlString new html string to be rendered
 */
export function render (replacedNodeSelector, htmlString) {
  const fragment = document.createRange().createContextualFragment(htmlString)
  const replacedNode = document.querySelector(replacedNodeSelector)

  replacedNode.parentNode.replaceChild(fragment, replacedNode)
}

/**
 * Helper to escape unsafe characters in HTML, including &, <, >, ", ', `, =
 * @param {String} str String to be escaped
 * @return {String} escaped string
 */
export function escapeSpecialChars (str) {
  if (typeof str !== 'string') throw new TypeError('escapeSpecialChars function expects input in type String')

  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return str.replace(/[&<>"'`=]/g, function (m) { return escape[m] })
}

export function generateCustomTicketKey (str) {
  return ('ticket.customField:custom_field_' + str)
}

export const parseValue = (key, value) => {
  let parsedValue = value ? value : "";
  parsedValue = parsedValue.replaceAll("_", " ");
  const lowercaseKey = key.toLowerCase();
  if (lowercaseKey.includes("price") || lowercaseKey.includes("amount") || lowercaseKey.includes("fee") || lowercaseKey.includes("credits") || lowercaseKey.includes("deposit")) {
    parsedValue = "$" + parsedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (parsedValue === parsedValue.toUpperCase() && (lowercaseKey !== "verse file number" && lowercaseKey !== "state")) {
    parsedValue = toTitleCase(parsedValue.toLowerCase())
  } else if (parsedValue === "true" || parsedValue === "false") {
    parsedValue = toTitleCase(parsedValue);
  } 
  return parsedValue;
}

export const parseName = (key) => {
  return key
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt){
    if ((txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) === "And") {
      return "and"
    } else {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  });
}