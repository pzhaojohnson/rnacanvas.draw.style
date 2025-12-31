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

However, object properties with values of `null` result in corresponding attributes being removed.

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

## `class DrawingElementValues`

A collection of values (e.g., properties)
for an RNAcanvas drawing element.

```typescript
/**
 * RNAcanvas drawing elements generally follow this interface.
 **/
interface DrawingElement {
  readonly domNode: SVGElement;

  // any number of properties
  // ...
}
```

Properties are defined at construction using property definition objects.

```javascript
var values = new DrawingElementValues({
  'basePadding': {
    value: 2,
    isValid: value => typeof value == 'number' && Number.isFinite(value),
  },
});

var ele = { domNode: document.createElementNS('http://www.w3.org/2000/svg', 'circle') };

ele.basePadding; // undefined

values.applyTo(ele);

ele.basePadding; // 2
```

In the example above,
the `basePadding` property is initialized to a value of `2`.

The validator function (with key `isValid`)
enforces that base padding values be numbers and are finite.

The validator function for a property should return a truthy value for valid values
and a falsy value for invalid values.

The validator function is used to screen values whenever an attempt is made to set a property.

Invalid values are ignored (without throwing)
when attempting to set properties.

Properties can also be left unspecified (while still being defined)
at the time of construction.

```javascript
var values = new DrawingElementValues({
  textPadding: {
    // no value specified
    isValid: value => typeof value == 'number' && Number.isFinite(value),
  },
});
```

All properties must at least be defined at the time of construction.

### `applyTo()`

Applies the values to a drawing element.

Properties with values of `undefined` are not applied to drawing elements.

Values are applied independently of one another
(e.g., if setting one property were to cause an error to be thrown,
the setting of other properties would not be affected).

This method never throws.
