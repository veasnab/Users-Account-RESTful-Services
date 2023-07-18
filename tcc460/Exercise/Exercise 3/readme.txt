For the Weather API implementation, the following endpoints/APIs are listed:

    - https://api.openweathermap.org
    When loading on screen, the browser will ask and take the user's latitude and longitude, and this will populate the user's local weather for that day.

    - https://nominatim.openstreetmap.org
    Since the openweathermap API requires latitude and longitude, I realized that I had to find a way to obtain these values using the City, State, and Country. 
    This API allows me to find the latitude and longitude based on the user selecting a location from a dropdown menu. 
    Sometimes, some locations are not found, and a window alert will notify the user.

    - http://api.geonames.org
    I use this API to allow me to populate the Country and then populate the State based on the Country selected from a dropdown menu. 
    The State is then used to populate the City dropdown menu in the same fashion. 

    In Conclusion to the Weather API, when a user select a location from the dropdown that the endpoint "http://api.geonames.org" populate; 
    the selected location is than push to the "https://nominatim.openstreetmap.org" which convert the location to latitude and longitude. 
    At last, this cooridate are use in the "api.openweathermap.org" end-point to populate the Weather information. 

-----------------------------------------------------------------------------------

For the Youtube API implementation, the following endpoints/APIs are listed:

    -https://www.googleapis.com/youtube/v3/search
    In here, user can search up a video and get the following details: channel-title, song-title, desciptions, thumbnails, and the links.
    This is used to update the HTML to display after a search is submitted.  
    The link is use to re-direct to the youtube weppage to watch the video.  
