# Installation

With `npm`:

```
npm install @rnacanvas/draw.style
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// an example import
import { SVGElementAttributes } from '@rnacanvas/draw.style';
```

## `class SVGElementAttributes`

Represents a collection of attributes that can be applied to SVG elements.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',
  'fill': 'blue',
  'stroke-width': 2,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle);

circle.getAttribute('stroke'); // "red"
circle.getAttribute('fill'); // "blue"

// non-string values are converted to strings
circle.getAttribute('stroke-width'); // "2"
```

Attributes should be specified in an object.

To facilitate the processing of user inputs,
the `SVGElementAttributes` class constructor can receive unknown data types.

Non-object data types are ignored. (No errors are thrown.)

```javascript
// none of these throw errors
new SVGElementAttributes(undefined);
new SVGElementAttributes(null);
new SVGElementAttributes(true);
new SVGElementAttributes(2);
new SVGElementAttributes('asdf');
```

### `set()`

Set attributes.

```javascript
var attributes = new SVGElementAttributes();

attributes.set({
  'stroke': 'red',
  'fill': 'blue',
  'stroke-width': 2,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle);

circle.getAttribute('stroke'); // "red"
circle.getAttribute('fill'); // "blue"

// non-string values are converted to strings
circle.getAttribute('stroke-width'); // "2"
```

Attributes should be specified in an object.

To facilitate the processing of user inputs,
the `set()` method can receive unknown data types.

Non-object data types are ignored. (No errors are thrown.)

```javascript
var attributes = new SVGElementAttributes();

// none of these throw errors
attributes.set(undefined);
attributes.set(null);
attributes.set(true);
attributes.set(2);
attributes.set('asdf');
```
