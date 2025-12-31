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

The constructor ignores object properties of `undefined` or `null`.

Non-string attribute values are converted to strings.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',
  'fill': 'blue',
  'stroke-opacity': undefined,
  'stroke-dasharray': null,
  'stroke-width': 2,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle);

circle.getAttribute('stroke'); // "red"
circle.getAttribute('fill'); // "blue"

// ignored
circle.getAttrbute('stroke-opacity'); // null
circle.getAttrbute('stroke-dasharray'); // null

// non-string values are converted to strings
circle.getAttribute('stroke-width'); // "2"
```

Attributes should be specified in an object.

To facilitate the processing of user inputs,
the `SVGElementAttributes` class constructor is able to receive data in unknown formats.

Data in invalid formats are ignored (without throwing).

### `has()`

Returns `true` if the queried attribute is present.

```javascript
var attributes = new SVGElementAttributes({ 'stroke': 'red' });

attributes.has('stroke'); // true
attributes.has('fill'); // false

attributes.set({ 'fill': 'blue' });

attributes.has('fill'); // true

// remove attribute
attributes.set({ 'stroke': null });

attributes.has('stroke'); // false
```

### `get()`

Returns the (string) value of the specified attribute.

Throws if the attribute has not been set.

```javascript
var attributes = new SVGElementAttributes({ 'stroke': 'red' });

attributes.get('stroke'); // "red"

// attribute not present
attributes.get('fill'); // throws

attributes.set({ 'fill': 'blue' });

attributes.get('fill'); // "blue"
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

Attributes are to be specified in an object.

Object properties with values of `undefined` are ignored.

However, object property values of `null` result in corresponding attributes being removed.

```javascript
var attributes = new SVGElementAttributes();

attributes.set({
  'stroke': 'red',
  'fill': undefined,
});

var circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle1);

circle1.getAttribute('stroke'); // "red"

// ignored
circle1.getAttribute('fill'); // null

// remove attribute
attributes.set({ 'stroke': null });

var circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle2);

// was removed
circle1.getAttribute('stroke'); // null
```

To facilitate the processing of user inputs,
the `set()` method can receive data in unknown formats.

Data in invalid formats will be ignored (without throwing).

### `applyTo()`

Apply the attributes to a given SVG element.

### `serialized()`

Returns the collection of attributes as a plain object
(that can be converted to a JSON string, for instance).

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',
  'fill': 'blue',
  'stroke-width': 2,
});

// non-string attribute values are converted to strings
attributes.serialized(); // {
//   "stroke": "red",
//   "fill": "blue",
//   "stroke-width": "2",
// }
```
