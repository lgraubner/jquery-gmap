# jQuery.gmap Plugin

> Stop wasting your time typing Google Maps API code. Be more efficient.

To display a neat Google Map you have to write the same basic code every time. This plugin helps to create Google Maps with less code.

## Dependencies

As this is a jQuery plugin it depends on the jQuery library and of course the Google Maps API v3. Thats it.

## Usage

Include the Google Maps API v3 and `jquery.gmap.min.js` somewhere on your site, preferably before the closing `body` tag.

Create an element:
```HTML
<div id="map"></div>
```

Initialize your map:
```JavaScript
$("#map").gmap({
    coords: "52.5075419,13.4251364",
    options: {
        disableDefaultUI: true,
        zoom: 13
    },
    marker: [
        {
            coords: "52.5075419,13.4251364",
            title: "I am the title",
            info: {
                content: "This is an info popup",
                show: true
            }
        }
    ]
});
```

The same map code *without* `jquery.gmap` would look like this:

```JavaScript
var options = {
    disableDefaultUI: true,
    zoom: 13,
    center: new google.maps.LatLng(52.5075419, 13.4251364)
}
var map = new google.maps.Map(document.getElementById("map"), options);

var marker = new google.maps.Marker({
    position: new google.maps.LatLng(52.5075419, 13.4251364),
    title: "I am the title",
    map: map
});

var infowindow = new google.maps.InfoWindow({
    content: "This is an info popup"
});

google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker);
});

infowindow.open(map, marker);
```

You can also specify options inline. These options will override any other options! You still have to initialize the map.

```HTML
<div id="map" data-gmap-options='{"zoom":8}' data-gmap-coords="52.5075419,13.4251364" data-gmap-marker='[{"coords":"52.5075419,13.4251364"}]'></div>
```

```JavaScript
$("#map").gmap();
```
