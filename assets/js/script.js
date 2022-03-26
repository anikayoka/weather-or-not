function getApi() {
  // TODO: Insert the API url to get a list of your repos
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=21.4691&lon=78.6569&appid=24a91c7139dc950ad59b35f668ee88c8'

  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 0; i < data.length; i++) {
        // Create a list element
        var listItem = document.createElement('li');

        // Set the text of the list element to the JSON response's .html_url property
        listItem.textContent = data[i].html_url;

        // Append the li element to the id associated with the ul element.
        repoList.appendChild(listItem);
      }
    });
}

fetchButton.addEventListener('click', getApi);