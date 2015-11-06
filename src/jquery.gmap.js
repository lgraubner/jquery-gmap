/**
 * jQuery Wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 1.5.0
 * @license MIT
 */
;(function(window, document, $, undefined) {
    "use strict";

    var pluginName = "gmap";

    /**
     * Plugin constructor.
     *
     * @param {Object} element element to use
     * @param {Object} options options to use
     */
    function Plugin(element, options) {
        this.$el = $(element);
        var data = this.$el.data();

        for (var p in data) {
            if (data.hasOwnProperty(p) && /^gmap[A-Z]+/.test(p)) {
                var shortName = p[pluginName.length].toLowerCase() + p.substr(pluginName.length + 1);
                data[shortName] = data[p];
            }
        }

        this.settings = $.extend(true, {}, $.fn[pluginName].defaults, options, data);

        this._name = pluginName;
        this.init();
    }

    /**
     * Extend prototype with functions.
     */
    $.extend(Plugin.prototype, {
        /**
         * Init all markers passed in options Object.
         */
        _initMarker: function() {
            $.each(this.settings.marker, $.proxy(function(key, marker) {
                var coords = marker.coords.split(",");
                var m = new google.maps.Marker({
                    position: new google.maps.LatLng(coords[0], coords[1]),
                    icon: (marker.icon ? new google.maps.MarkerImage(marker.icon) : null),
                    title: marker.title,
                    map: this.map
                });

                if (marker.info) {
                    var infowindow = new google.maps.InfoWindow({
                        content: marker.info.content
                    });

                    google.maps.event.addListener(m, 'click', $.proxy(function() {
                        if (this._currInfoWindow !== undefined) {
                            this._currInfoWindow.close();
                        }
                        infowindow.open(this.map, m);
                        this._currInfoWindow = infowindow;
                    }, this));

                    if (marker.info.show) {
                        infowindow.open(this.map, m);
                    }
                }
            }, this));
        },

        /**
         * Initialize Google Map and add listener for resize.
         */
        _initMap: function() {
            var coords = this.settings.coords.split(",");

            var options = $.extend({
                center: new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]))
            }, this.settings.options);

            this.map = new google.maps.Map(this.$el.get(0), options);

            google.maps.event.addDomListener(window, 'resize', $.proxy(function() {
                var center = this.map.getCenter();
                google.maps.event.trigger(this.map, 'resize');
                this.map.setCenter(center);
            }, this));
        },

        /**
         * Proxies map events to listen for them the jquery way.
         */
        _addEventHandlers: function() {
            var handlers = ["bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "heading_changed", "idle", "maptypeid_changed", "mousemove", "mouseout", "mouseover", "projection_changed", "resize", "rightclick", "tilesloaded", "tilt_changed", "zoom_changed"];

            function attachHandler(map, $el, handler) {
                map.addListener(handler, function() {
                    $el.trigger(handler + ".gmap");
                });
            }

            var i;
            for (i = 0; i < handlers.length; i++) {
                attachHandler(this.map, this.$el, handlers[i]);
            }
        },

        /**
         * Wrapper for setCenter function.
         *
         * @param  {String} comma seperated latlng     Map coordinates to set as map center
         */
        setCenter: function(coords) {
            var c = coords.split(",");
            var latlng = new google.maps.LatLng(parseFloat(c[0]), parseFloat(c[1]));
            this.map.setCenter(latlng);
        },

        /**
         * Wrapper for setOptions function.
         *
         * @param  {Object} options     options to be changed
         */
        setOptions: function(options) {
            this.map.setOptions(options);
        },

        /**
         * Wrapper for setZoom function.
         *
         * @param  {Object} options     options to be changed
         */
        setZoom: function(zoom) {
            this.map.setZoom(zoom);
        },

        /**
         * Return raw Google Map Object.
         *
         * @return {Map}   Google Map object
         */
        getMap: function() {
            return this.map;
        },

        /**
         * Init function.
         */
        init: function() {
            this._initMap();
            this._addEventHandlers();

            if (this.settings.marker) {
                this._initMarker();
            }
        }
    });

    /**
     * Extend jQuery object with the new plugin.
     */
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
            var returns;

            this.each(function() {
                var instance = $.data(this, "plugin_" + pluginName);

                if (instance instanceof Plugin && typeof instance[options] === "function") {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === "destroy") {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }

    };

    /**
     * Set plugin defaults.
     *
     * @type {Object}
     */
    $.fn[pluginName].defaults = {
        options: {
            draggable: true,
            scrollwheel: true,
            disableDefaultUI: false,
            disableDoubleClickZoom: false,
            mapTypeControl: false,
            zoom: 11
        }
    };
})(window, document, jQuery);
