# jQuery.gmap

[![David Dev](https://img.shields.io/david/dev/lgraubner/jquery-gmap.svg)](https://david-dm.org/lgraubner/jquery-gmap#info=devDependencies)

> Stop wasting your time typing Google Maps API code. Be more efficient.

To display a neat Google Map you have to write the same basic code every time. This plugin helps to create Google Maps with less code.

## Dependencies

As this is a jQuery plugin it depends on the jQuery library and of course the Google Maps API v3. Thats it.

## Usage

Include the Google Maps API v3 and `jquery.gmap.min.js` somewhere on your site, preferably before the closing `body` tag.

```HTML
<script src="https://maps.googleapis.com/maps/api/js?v=3&libraries=places" type="text/javascript"></script>
<script src="path/to/jquery.gmap.min.js"></script>
```

Create an element:
```HTML
<div id="map"></div>
```

Initialize your map:

```JavaScript
var $map = $('#map').gmap({
  lat: 52.5075419,
  lng: 13.4251364,
  options: {
    disableDefaultUI: true,
    zoom: 13
  }
});

$map.gmap('addMarker', {
  lat: 52.5075419,
  lng: 13.4251364,
  title: 'I am the title'
  infoWindow: {
    content: 'This is an info popup',
    opened: true
  }
});
```

The same map code *without* `jquery.gmap` would look like this:

```JavaScript
var options = {
  disableDefaultUI: true,
  zoom: 13,
  center: new google.maps.LatLng(52.5075419, 13.4251364)
}
var map = new google.maps.Map(document.getElementById('map'), options);

var marker = new google.maps.Marker({
  position: new google.maps.LatLng(52.5075419, 13.4251364),
  title: 'I am the title',
  map: map
});

var infowindow = new google.maps.InfoWindow({
  content: 'This is an info popup'
});

google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map, marker);
});

infowindow.open(map, marker);
```

You can also specify options inline which will overwrite the default value and the value specified on initialization. You still have to initialize the map.

```HTML
<div id="map" data-gmap-options='{"zoom":8}' data-gmap-lat="52.5075419" data-gmap-lng="13.4251364"></div>
```

```JavaScript
$('#map').gmap();
```

## Options

### centerOnResize

Type: `boolean`  
Default: `true`

Recenter the map to the current center if map gets resized.

### singleInfoWindow

Type: `boolean`  
Default: `true`

Only open one `infoWindow` at most. Automatically closes opened `infoWindow` if you click on a marker to open a different.

## API

jQuery.gmap offers several methods which are wrappers for common Google Map API functions.

### addMarker

Add a marker to a previously initialized map. You can attach an `infoWindow` with some content,
set the marker icon and add a title. The optional `infoWindow` can be toggle via click on the marker.

```JavaScript
$map.gmap('addMarker', {
  lat: 52.5075419,
  lng: 13.4251364,
  title: 'I\'m a title!',
  icon: '/path/to/icon.ext',
  infoWindow: { // optional
    content: 'Some content',
    opened: true // whether it should be opened on init
  }
});
```

### setOptions

Set options after initialization. Extends current options, does not replace.

```JavaScript
$('#map').gmap('setOptions', {
  scrollwheel: false,
  draggable: true
});
```

### getMap

Not all features of Google Maps API v3 are covered by jquery.gmap. Therefore you can get the raw `Map` object and work with it as normal.

```JavaScript
var $gmap = $('#map').gmap({
  ...
});

var map = $gmap.getMap();
// do whatever you like
var id = map.getDiv();
```

### getMarker

Get all initialized marker objects.
