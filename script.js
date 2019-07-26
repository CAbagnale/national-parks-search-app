function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(baseUrl, states, maxResults, apiKey) {
  const params = {
    stateCode: states,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = baseUrl + '?' + queryString + '&api_key=' + apiKey;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  $('#js-parks-display').html('');
  console.log(responseJson);
  for (let i=0; i < responseJson.data.length; i++) {
    $('#js-parks-display').append(`<li>
    <h1><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h1>
    <p>${responseJson.data[i].description}</p>
    </li>`);
    $('#js-state-display').html(`${responseJson.total} parks found (${responseJson.data.length} displayed):`);
  }
  $('.results').removeClass('hidden');
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('.results').addClass('hidden');
    const baseURL = 'https://developer.nps.gov/api/v1/parks';
    const states = $('#js-search-state').val().replace(/\s/g, "").split(",");
    const maxResults = $('#js-max-results').val();
    const apiKey = 'INSERT API KEY HERE';
    getParks(baseURL, states, maxResults, apiKey);
  });
}

$(watchForm);