# StateManager
Javascript handling for mediaquery breakpoints.

## Dependencies

* jQuery

## Supported Browsers

* Chrome 10+
* Firefox 6+
* Safari 5.1+
* IE 10+

For support of older browsers use this polyfill: https://github.com/paulirish/matchMedia.js

## Usage


Initialize:

```JavaScript
var sm = new StateManager();
```

Initialize with breakpoints:

```JavaScript
var sm = new StateManager([
    {
        name: "mobile",
        mq: "(max-width: 768px)",
        match: function() {

        },
        unmatch: function() {

        }
    },
    {
        name: "desktop",
        mq: "(min-width: 769px)",
        match: function() {

        },
        unmatch: function() {

        }
    }
]);
```

Add Breakpoints after initialization:

```JavaScript
sm.addState({
    {
        name: "tablet",
        mq: "(min-width: 768px) and (max-width: 990px)",
        match: function() {

        },
        unmatch: function() {

        }
    }
});
```

### API

* addState
* matchState
* destroy
