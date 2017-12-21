$(document).ready(function() {
      var navHeight = $("nav").height();
      $("nav li").show();
      $(".dropdown").hide();
  $(window).scroll(function() {
    // if scrolled a greater amount then the initial height of the nav..
      if ($(document).scrollTop() > navHeight){
          //shrink icon
           $(".logo").addClass("logoShrink");
           //shrink nav
           $("nav").addClass("navShrink");
           // keep the links centered in the nav
           $(".navLogo").addClass("keepCenter");
           $(".nameTag").addClass("nameTagShrink");
           // move the dropdown up so it is still on the lower edge of the nav
           $(".dropdown").css("top","69px"); //equal to nav height-1
       
      } else {
     // otherwise if no scroll or scroll back up take off the settings
        $(".logo").removeClass("logoShrink");
        $("nav").removeClass("navShrink");
        $(".navLogo").removeClass("keepCenter");
        $(".nameTag").removeClass("nameTagShrink");

        $(".dropdown").css("top","77px");//equal to nav height
      }
    });
}); 

var queryURL = "http://api.airvisual.com/v1/nearest?key=DaHqdonP4rSRvKgZQ";

$.ajax({
  url: queryURL,
  method: "GET"
}).done(function (response) {
  $(".pollution").append(response.data.current.pollution.aqius);

});



// on click 
$("#submit").click(function () {
  var distance = $("#distance-input").val().trim();
  var duration = $("#duration-input").val().trim();
  var time = $("#resist-input").val().trim();
  var heart = $("#heart-input").val().trim();

  //pushing into firebase
  database.ref().push({
    distance: distance,
    duration: duration,
    time: time,
    heart: heart
  })

  $("input").val('');
  return false;
});

// pulls data
database.ref().on("child_added", function (childSnapshot) {

  var distance = childSnapshot.val().distance;
  var duration = childSnapshot.val().duration;
  var time = childSnapshot.val().time;
  var heart = childSnapshot.val().heart;
  var firstTime = moment(time, "hh:mm").subtract(1, "years");
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTime), "minutes");
  var theR = diffTime % heart;
  var theMinutes = heart - theR;
  var nextThing = moment().add(theMinutes, "minutes").format("hh:mm:ss");


  //displays on top  
  var listing = $("<tr/>").attr("data-name", distance);
  listing.append($("<td/> ").text(distance));
  listing.append($("<td/> ").text(duration));
  listing.append($("<td/> ").text(time));
  listing.append($("<td/> ").text(nextThing));
  listing.append($("<td/> ").text(heart));
  $(".table").append(listing);

});	


window.onload = function () {
  $("#lap").click(stopwatch.recordLap);
  $("#stop").click(stopwatch.stop);
  $("#reset").click(stopwatch.reset);
  $("#start").click(stopwatch.start);


};

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

// Our stopwatch object
var stopwatch = {

  time: 0,
  lap: 1,

  reset: function () {

    stopwatch.time = 0;
    stopwatch.lap = 1;

    // DONE: Change the "display" div to "00:00."
    $("#display").text("00:00");

    // DONE: Empty the "laps" div.
    $("#laps").text("");
  },
  start: function () {

    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(stopwatch.count, 1000);
      clockRunning = true;
    }
  },
  stop: function () {

    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  recordLap: function () {

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);

    // DONE: Add the current lap and time to the "laps" div.
    $("#laps").append("<p>Lap " + stopwatch.lap + " : " + converted + "</p>");

    // DONE: Increment lap by 1. Remember, we can't use "this" here.
    stopwatch.lap++;
  },
  count: function () {

    // DONE: increment time by 1, remember we cant use "this" here.
    stopwatch.time++;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);
    console.log(converted);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $("#display").text(converted);
  },
  timeConverter: function (t) {

    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    } else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }
};

// weather
$(document).ready(function () {
  getLocationAndWeather('Imperial');
  $('.scale-btn').click(switchScale);
});

function switchScale() {
  if ($('.scale-btn>h1').text() === 'C') {
    $('.scale-btn>h1').text('F');
    $('.scale-btn').blur();
    getLocationAndWeather('Imperial');
  } else {
    $('.scale-btn>h1').text('C');
    $('.scale-btn').blur();
    getLocationAndWeather('Metric');
  }
}

function getLocationAndWeather(scale) {
  console.log("Get location and weather");
  // get location via IP address:
  $.getJSON("https://ipapi.co/json", function (response) {
    console.log(response);
    getWeather(response.postal, scale);
  });
}

function getWeather(location, scale) {
  var weather = {};
  var key = 'VyTcnJ9XnGTx6bInabCmygdzGrWtZ7xA';

  // First we need the location key
  $.getJSON(
    'https://dataservice.accuweather.com/locations/v1/postalcodes/search', {
      apikey: key,
      q: location
    },
    function (loc_results) {
      // Then use it to fetch weather results
      var weather_url = 'https://dataservice.accuweather.com/currentconditions/v1/' + loc_results[0].Key;
      $.getJSON(weather_url, {
        apikey: key,
        details: 'true'
      }, function (results) {
        var wthr = {
          city: loc_results[0]['LocalizedName'],
          wind_speed: results[0]['Wind']['Speed'][scale]['Value'],
          wind_unit: results[0]['Wind']['Speed'][scale]['Unit'],
          wind_dir: results[0]['Wind']['Direction']['Localized'],
          type: results[0]['WeatherText'],
          humidity: results[0]['RelativeHumidity'],
          temp: results[0]['Temperature'][scale]["Value"]
        };
        setWeatherNodes(wthr, scale);
      });
    });
}

function setWeatherNodes(weather, scale) {
  $('.mdl-card__title-text').text(weather['city']);
  $('#type').text(weather['type']);
  $('#humidity').text('Humidity: ' + weather['humidity'] + '%');

  $('#wind').text('Wind: ' + weather['wind_speed'] + ' ' +
    weather['wind_unit'] + ' ' +
    weather['wind_dir']);

  $('.temperature').contents().filter(function () {
    return this.nodeType === Node.TEXT_NODE;
  })[0].nodeValue = parseInt(weather['temp']) + '\u00B0';

  setWeatherTypeNodes(weather['type']);
}

function setWeatherTypeNodes(wType) {
  // Change Partly Sunny to Sunny, etc.
  wType = (wType.indexOf("sunny") !== -1 ? "Sunny" : wType);
  wType = (wType.indexOf("cloudy") !== -1 ? "Cloudy" : wType);

  var bgUrls = {
    Sunny: 'https://static.pexels.com/photos/478939/pexels-photo-478939.jpeg',
    Clear: 'https://static.pexels.com/photos/147485/pexels-photo-147485.jpeg',
    Drizzle: 'https://static.pexels.com/photos/39811/pexels-photo-39811.jpeg',
    Rain: 'https://static.pexels.com/photos/1553/glass-rainy-car-rain.jpg',
    Cloudy: 'https://www.google.com/search?q=sunny+icon&rlz=1C5CHFA_enUS764US764&tbm=isch&source=iu&ictx=1&fir=Klh1gLinpkBAPM%253A%252CvyAkYH4zC8nvuM%252C_&usg=__iu0Sj3abFGwp31xJVfH7ZffX-ZQ%3D&sa=X&ved=0ahUKEwi1jpH-i4_YAhVh4oMKHTUGCYkQ9QEIKzAA#imgrc=Klh1gLinpkBAPM:',
    Mist: 'https://static.pexels.com/photos/5106/forest-trees-fog-foggy-large.jpg',
    Thunderstorm: 'https://static.pexels.com/photos/799/city-lights-night-clouds.jpg',
    Snow: 'https://static.pexels.com/photos/5254/cold-snow-nature-sunny.jpg'
  };

  var icons = {
    Sunny: ['wi-day-sunny', '#FDD835'],
    Rain: ['wi-rain', '#2196F3'],
    Cloudy: ['wi-cloudy', '#CFD8DC'],
    Mist: ['wi-fog', '#90A4AE'],
    Thunderstorm: ['wi-thunderstorm', '#37474F'],
    Snow: ['wi-snow', '#B2EBF2'],
    Drizzle: ['wi-sprinkle', '#2196F3']
  };

  $('.weather-icon').css({
    'background': '#fafafa url(' + bgUrls[wType] + ')'
  });

  //Change the icon
  $('.weather-icon').removeClass('wi-day-sunny wi-rain wi-cloudy wi-fog wi-thunderstorm wi-snow');
  $('.weather-icon').addClass(icons[wType][0]);
  $('.weather-icon').css({
    'color': icons[wType][1]
  });
}

var locations = [
  ['Walnut Creek', 30.400478, -97.680639, 4],
  ['Zilker Park', 30.267630, -97.765049, 5],
  ['Barton Creek', 30.245227, -97.813598, 3],
  ['Circle C Park', 30.198538, -97.887071, 2],

];

// When the user clicks the marker, an info window opens.

window.initMap = function () {
  var myLatLng = { lat: 30.19, lng: -97.69 };

  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 10,
    center: myLatLng
  });

  var count = 0;

  for (count = 0; count < locations.length; count++) {

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[count][1], locations[count][2]),
      map: map
    });

    marker.info = new google.maps.InfoWindow({
      content: locations[count][0]
    });


    google.maps.event.addListener(marker, 'click', function () {
      // this = marker
      var marker_map = this.getMap();
      this.info.open(marker_map, this);
      // Note: If you call open() without passing a marker, the InfoWindow will use the position specified upon construction through the InfoWindowOptions object literal.
    });
  }
}

// challenge routines js
$("#ex13").slider({
  ticks: [0, 50, 100],
  ticks_labels: ["Easy", "Medium", "Hard"],
  ticks_snap_bounds: 50
});

var a = ["Push ups", "Jump Rope", "Air Squats", "Sit-ups", "Stationary Bike", "Squats", "Burpees", "Planks"];
var repsDif = ["10", "5", "12", "10", "8", "10", "5"];

//Fisher–Yates shuffle algorithm:
function shuffle() {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

function shuffle2() {
  var j, x, i;
  for (i = repsDif.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = repsDif[i];
    repsDif[i] = repsDif[j];
    repsDif[j] = x;
  }
}

$("#SubmitBtn").on("click", function () {
  $("#result").removeClass("hide");
  $("#result > tbody").empty().append("<tr><th>" + "Excercise" + "</th><th>" + "Sets" + "</th><th>" + "Reps" + "</th></tr>")
  var level = $("#ex13").val();
  shuffle(a);
  shuffle2(repsDif);

  if (level == 50) {
    var dif = 5;
    var sets = ["3"];
  } if (level < 50) {
    var dif = 3;
    sets = ["2"];
  } if (level > 50) {
    var dif = 7;
    sets = ["4"];
  }

  for (var i = 0; i < dif; i++) {
    var exer = a[i];
    var reps = repsDif[i];
    var set = sets[0];
    $("#result > tbody").append("<tr><td>" + exer + "</td><td>" + set + "</td><td>" + reps + "</td></tr>")
  };
});			



//end document ready