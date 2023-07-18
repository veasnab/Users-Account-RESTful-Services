//Navigation to display client interface from a drop-down menu
$('.navbar-toggler').click(function () {
  $('.collapse').toggleClass('show');
  $('ul.navbar-nav').css('float', 'right');
  $('ul.navbar-nav').css('margin', '10px');
});

$('p').css({
  'text-align': 'center',
  'font-size': '16px'
});

// Weather-Style
$('.weather-container').css({
  'display': 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  'justify-content': 'center',
  'border-radius': '10px',
  'padding': '20px',
  'box-shadow': '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
  'max-width': '500px',
  'margin': '0 auto',
  'background': 'linear-gradient(to bottom, white, skyblue)',
  'color': 'black'

});
$('.weather-container h2').css({
  'font-size': '28px',
  'margin-bottom': '20px'
});
$('.weather-container img').css({
  'width': '200px',
  'height': '200px',
  'margin-bottom': '20px'
});
$('.weather-container p').css({
  'font-size': '18px',
  'margin-bottom': '10px'
});
$('span').css({
  'font-weight': 'bold'
});

// Music-Style
$('form').css('text-align', 'center');
$('.youtube-container, .search-result').css({
  'display': 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  'justify-content': 'center',
  'border-radius': '10px',
  'padding': '20px',
  'box-shadow': '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
  'max-width': '500px',
  'margin': '0 auto',
  'background': 'linear-gradient(to bottom, pink, skyblue)',
  'color': 'black'
});

$('.video').css({
  'display': 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  'justify-content': 'center',
  'border-radius': '10px',
  'padding': '20px',
  'max-width': '500px',
  'margin': '0 auto',
  'color': 'black',
  'border': '3px solid black',
  'width': '450px',
  'margin-top': '20px'
});


//default to alwaus hide the weather and playlist container
$(".weather-container").hide();
$(".youtube-container").hide();
$(".video").hide();

// when the weather API link is click
$('#weather-api').on('click', function (event) {
  event.preventDefault();

  // Get CURRENT user's location
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    $(".weather-container h2").text("Local Weather");
    //call WeatherSearch and Update HTML.
    WeatherSearch(lat, lon);
    // hide the follow ... 
    $('.collapse').removeClass('show');
    $(".youtube-container").hide();

    $(".weather-container").show();
  });
});

// when the YouTube API link is click
$('#youtube-api').on('click', function (event) {
  event.preventDefault();
  // hide the following
  $('.collapse').removeClass('show');
  $(".weather-container").hide();

  $(".youtube-container").show();
});

//Latitide and Longitude is pass and update HTML with current Weather
function WeatherSearch(lat, lon) {
  //API and KEYS
  const apiKey = '05164fdb35c2e7e363777e9f0a803eaa';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // get data from 
  $.getJSON(url, function (data) {
    var iconUrl = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    var description = data.weather[0].description;
    var tempK = data.main.temp;
    var humidity = data.main.humidity;

    // Convert temperature from Kelvin to Celsius and Fahrenheit
    var tempC = Math.round(tempK - 273.15);
    var tempF = Math.round((tempK - 273.15) * 9 / 5 + 32);

    // Set initial temperature unit to Celsius
    var tempUnit = "C&deg /<small>F</small>";
    var tempVal = tempC;

    // Update HTML with weather data
    $('.icon').attr('src', iconUrl);
    $('.description').html(description.charAt(0).toUpperCase() + description.slice(1) + ".");
    $('.temperature').html(tempVal + " " + tempUnit);
    $('.humidity').html(humidity + "%");

    // Toggle temperature unit on click
    $('.temperature').click(function () {
      if (tempUnit === "C&deg /<small>F</small>") {
        tempUnit = "F&deg /<small>C</small>";
        tempVal = tempF;
      } else {
        tempUnit = "C&deg /<small>F</small>";
        tempVal = tempC;
      }
      $('.temperature').html(tempVal + " " + tempUnit);
    });
  });
};

//search: Country, State, City
// this is using https://nominatim.openstreetmap.org end point to get the latitude and longitude 
function performWeatherSearch() {

  var country = $("#country-dropdown option:selected").text();
  var state = $("#state-dropdown option:selected").text();
  var city = $("#city-dropdown option:selected").text();

  var address = city + ", " + state + ", " + country;
  var url = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(address);
  $.getJSON(url, function (data) {
    if (data.length > 0) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      console.log("Latitude: " + lat + ", Longitude: " + lon);
      $(".weather-container h2").text(state + ", " + city);
      WeatherSearch(lat, lon);
    } else {
      alert("Location not found, Please select another location.");
    }
  });
};

// this is using https://www.geonames.org/ end point to populate: countries, states, and city.
$('select').css('width', '60%');
const username = 'veasnab';
// Populate country dropdown
$(document).ready(function () {
  // Populate countries dropdown
  $.getJSON(`http://api.geonames.org/countryInfoJSON?username=${username}`, function (data) {
    $.each(data.geonames, function (i, country) {
      $('#country-dropdown').append($('<option>').text(country.countryName).attr('value', country.geonameId));
    });
  });

  // Populate states/provinces dropdown
  $('#country-dropdown').change(function () {
    var countryId = $(this).val();
    if (countryId) {
      $.getJSON(`http://api.geonames.org/childrenJSON?geonameId=${countryId}&username=${username}`, function (data) {
        $('#state-dropdown').empty().append($('<option>').text('Select a State/Province').attr('value', ''));
        $.each(data.geonames, function (i, state) {
          if (state.adminCode1) {
            $('#state-dropdown').append($('<option>').text(state.adminName1).attr('value', state.adminCode1));
          }
        });
      });
    } else {
      $('#state-dropdown').empty().append($('<option>').text('Select a State/Province').attr('value', ''));
    }
  });

  // Populate cities dropdown
  $('#state-dropdown').change(function () {
    var stateCode = $(this).val();
    if (stateCode) {
      $.getJSON(`http://api.geonames.org/searchJSON?adminCode1=${stateCode}&username=${username}`, function (data) {
        $('#city-dropdown').empty().append($('<option>').text('Select a City').attr('value', ''));
        $.each(data.geonames, function (i, city) {
          $('#city-dropdown').append($('<option>').text(city.name).attr('value', city.geonameId));
        });
      });
    }
  });
});


// Load the API client library
function search() {
  // Get the search from the user. 
  var searchVideo = $('#search-videos').val();
  if (searchVideo === "") {
    alert("Please enter a search a video.");
  } else {
    // Make a request to the YouTube API to search for videos
    $.ajax({
      url: "https://www.googleapis.com/youtube/v3/search",
      method: "GET",
      data: {
        q: searchVideo,
        part: "snippet",
        type: "video",
        key: "AIzaSyDrTlp-ArXjxcbcJG3lTcm0qpPKXq8QAks",
        order: 'viewCount',
        videoEmbeddable: 'true',
        maxResults: 5,
        regionCode: "US"

      },
      success: function (response) {
        // Handle the response
        for (var i = 0; i < 5; i++) {
          // Parse the data recieve and update HTML
          var thumbnail = response.items[i].snippet.thumbnails.medium.url;
          var videoId = response.items[i].id.videoId;
          var videoUrl = 'https://www.youtube.com/watch?v=' + videoId;
          var title = response.items[i].snippet.title;
          var channel = response.items[i].snippet.channelTitle;
          var about = response.items[i].snippet.description;
          count = i + 1;
          // set the html
          $('#frame-' + count).attr('src', thumbnail);
          $('.title-' + count).text(title);
          $('.channel-' + count).text(channel);
          $('.about-' + count).text(about);

          //update the link to the one search & make this like blue
          var $link = $('<a>').attr('href', videoUrl).text(videoUrl);
          if ($('.link-' + count + ' a').length) {
            // Link already exists, replace it
            $('.link-' + count + ' a').replaceWith($link);
          } else {
            // Link doesn't exist, add it
            $('.link-' + count).append($link);
          }
          $('.link-' + count + ' a').css('color', 'blue');
        }
        console.log(response.items);
      },
      error: function (xhr, status, error) {
        console.log("Error: " + error);
      }
    });
    $(".video").show();
  }
}

