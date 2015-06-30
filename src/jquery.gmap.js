/**
 * jQuery Wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 1.0.1
 * @license MIT
 */
;(function($) {
    "use strict";

    var $el, data, map;

    /**
     * Initializes all markers if specified.
     */
    var _initMarker = function() {
        var m, infowindow, coords;
        $.each(data.marker, function(key, marker) {
            coords = marker.coords.split(",");
            m = new google.maps.Marker({
                position : new google.maps.LatLng(coords[0], coords[1]),
                icon : (marker.icon ? new google.maps.MarkerImage(marker.icon) : null),
                title : marker.title,
                map : map
            });

            if (marker.info) {
                infowindow = new google.maps.InfoWindow({
                    content: marker.info.content
                });

                google.maps.event.addListener(m, 'click', function() {
                    infowindow.open(map, m);
                });

                if (marker.info.show) {
                    infowindow.open(map, m);
                }
            }
        });
    };

    /**
     * Initializes map.
     */
    var _initMap = function() {
        var coords = data.coords.split(","),
            options = $.extend({
                center: new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]))
            }, data.options);

        map = new google.maps.Map($el.get(0), options);

        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });
    };

    /**
     * Wrapper Object
     * @type {Object}
     */
    var gmap = {

        /**
         * Returns raw Google Map object.
         *
         * @return {Map}    Google Map
         */
        getMap: function() {
            return map;
        },

        /**
         * Initialize function for setting styles, options and variables.
         *
         * @param  {Object} options custom options to use
         *
         * @return  {Object}    jQuery element object
         */
        init: function(opts) {
            $el = $(this);

            var htmlData = $el.data();

            for (var p in htmlData) {
                if (htmlData.hasOwnProperty(p) && /^gmap[A-Z]+/.test(p)) {
                    var shortName = p[4].toLowerCase() + p.substr(5);
                    htmlData[shortName] = htmlData[p];
                }
            }

            if ($el.length > 0) {
                data = $.extend(true, {}, $.fn.gmap.defaults, htmlData, opts);

                _initMap();

                if (data.marker) {
                    _initMarker();
                }
            }

            return $el;
        }
    };

    /**
     * Extend jQuery with function.
     */
    $.fn.gmap = function(arg) {
        if (gmap[arg]) {
            return gmap[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof arg === 'object' || !arg) {
            return gmap.init.apply(this, arguments);
        } else {
            $.error('Method ' + arg + ' does not exist on jquery.gmap');
        }
    };

    /**
     * Set defaults.
     */
    $.fn.gmap.defaults = {
        options: {
            draggable: true,
            scrollwheel: true,
            disableDefaultUI: false,
            disableDoubleClickZoom: false,
            mapTypeControl: false,
            zoom: 11
        }
    };

})(jQuery);
