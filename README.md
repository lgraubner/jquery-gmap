# jQuery Google Maps API v3 Wrapper

## Dependencies

* jQuery

## Usage

```HTML
<div id="gmap" data-gmap-options='{"zoom":8}' data-gmap-coords="52.5075419,13.4251364"></div>
```

```JavaScript
$("#map").gmap({
    options: {
        disableDefaultUI: true
    },
    markers: {
        coords: "52.5075419,13.4251364",
        info: "This is an info popup"
    }
});
```
