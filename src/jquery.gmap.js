/**
 * jQuery Wrapper for Google Maps API v3.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 2.1.1
 * @license MIT
 */
(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var pluginName = 'gmap';

  /**
   * Plugin constructor.
   *
   * @param {Object} element element to use
   * @param {Object} options options to use
   */
  function Plugin(element, options) {
    var data = $(element).data();
    var p;
    var shortName;

    this.$el = $(element);
    this.mapElement = this.$el.get(0);

    for (p in data) {
      if (data.hasOwnProperty(p) && /^gmap[A-Z]+/.test(p)) {
        shortName = p[pluginName.length].toLowerCase() + p.substr(pluginName.length + 1);
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
     * Add a marker to the map.
     *
     * @param {Object} markerOptions  Options
     */
    addMarker: function (markerOptions) {
      var infowindow;
      var m = new google.maps.Marker({
        position: new google.maps.LatLng(markerOptions.lat, markerOptions.lng),
        icon: (markerOptions.icon ? new google.maps.MarkerImage(markerOptions.icon) : null),
        title: markerOptions.title,
        map: this.map,
      });

      if (markerOptions.infoWindow) {
        infowindow = new google.maps.InfoWindow({
          content: markerOptions.infoWindow.content,
        });

        google.maps.event.addListener(m, 'click', $.proxy(function () {
          if (this._currInfoWindow !== undefined && this.settings.singleInfoWindow) {
            this._currInfoWindow.close();
          }
          infowindow.open(this.map, m);
          this._currInfoWindow = infowindow;
        }, this));

        if (markerOptions.infoWindow.opened) {
          infowindow.open(this.map, m);
        }
      }

      this.marker.push(m);
    },

    /**
     * Removes given Marker.
     *
     * @param  {Marker} marker
     */
    removeMarker: function (marker) {
      marker.setMap(null);
    },

    /**
     * Wrapper for setOptions function.
     *
     * @param  {Object} options   options to be changed
     */
    setOptions: function (options) {
      this.map.setOptions(options);
    },

    /**
     * Return raw Google Map Object.
     *
     * @return {Map}   Google Map object
     */
    getMap: function () {
      return this.map;
    },

    /**
     * Return all marker.
     *
     * @return {Array}  Array of marker.
     */
    getMarker: function () {
      return this.marker;
    },

    /**
     * Init function.
     */
    init: function () {
      var options = $.extend({
        center: new google.maps.LatLng(this.settings.lat, this.settings.lng),
      }, this.settings.options);

      this.marker = [];
      this.map = new google.maps.Map(this.mapElement, options);

      if (this.settings.centerOnResize) {
        google.maps.event.addDomListener(window, 'resize', $.proxy(function () {
          var center = this.map.getCenter();
          google.maps.event.trigger(this.map, 'resize');
          this.map.setCenter(center);
        }, this));
      }
    },
  });

  /**
   * Extend jQuery object with the new plugin.
   */
  $.fn[pluginName] = function (options) {
    var args = arguments;
    var returns;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
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
    centerOnResize: true,
    singleInfoWindow: true,
    options: {
      draggable: true,
      scrollwheel: true,
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      mapTypeControl: false,
      zoom: 11,
    },
  };
});
