var geocoder;
var map;
var lat;
var lon;

function initialize() {
  geocoder = new google.maps.Geocoder();

  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
}

function codeAddress() {
	var address = document.getElementById('searchKeyword').value;
	
	geocoder = new google.maps.Geocoder();

	geocoder.geocode( {'address': address}, function(results, status) {
	  if (status == 'OK') {
	    map.setCenter(results[0].geometry.location);
	    var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
	    });
	    //alert(marker.position);
	    
	    lat = marker.getPosition().lat();
	    lon = marker.getPosition().lng();

	    console.log("위도 : "+ lat + ", 경도 : "+ lon);
	    
      var innerHTML = `
        <tr>
          <td>${address}</td>
          <td><input type="hidden" id="lat" name="lat" value="${lat}">${lat}</td>
          <td><input type="hidden" id="lon" name="lon" value="${lon}">${lon}</td>
          <td><button class="btn btn-primary wd-60 pd-0" style="height: 29.5px;" type="button" id="btnWeather" name="btnWeather" value="" onclick="weather();">날씨</button></td>
        </tr>
      `;
      document.getElementById('positionList').innerHTML = innerHTML;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
	});
} 

/* 위도 경도를 통해 날씨 구현부분 */
function weather() {
  var lat = document.getElementById('lat').value;
  var lon = document.getElementById('lon').value;
  
  var apiURI ="http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=YOUR_API_KEY";
  
  // Fetch API를 사용하여 데이터를 가져옵니다.
  fetch(apiURI)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(resp => {
    console.log(resp);
    console.log("현재온도 : " + (resp.main.temp - 273.15));
    console.log("현재습도 : " + resp.main.humidity);
    console.log("날씨 : " + resp.weather[0].main);
    console.log("상세날씨설명 : " + resp.weather[0].description);
    console.log("날씨 이미지 : " + resp.weather[0].icon);
    console.log("바람   : " + resp.wind.speed);
    console.log("나라   : " + resp.sys.country);
    console.log("도시이름  : " + resp.name);
    console.log("구름  : " + resp.clouds.all + "%");

    // HTML에 날씨 정보를 추가
    var weatherList = document.getElementById('weatherList');
    var innerHTML = `
    <tr>
        <td>${(resp.main.temp - 273.15).toFixed(2)}°C</td>
        <td>${resp.main.humidity}%</td>
        <td>${resp.weather[0].main}</td>
        <td>${resp.wind.speed} m/s</td>
        <td>${resp.clouds.all}%</td>
    </tr>`;


    document.getElementById('weatherList').innerHTML = innerHTML;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

initialize(); 
