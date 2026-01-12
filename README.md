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
  'stroke-width': 2,
});

// automatically converted to a string
attributes.get('stroke-width'); // "2"

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle);

circle.getAttribute('stroke'); // "red"
circle.getAttribute('stroke-width'); // "2"
```

Attributes assigned a value of `undefined` are ignored.

```javascript
var attributes = new SVGElementAttributes({
  'stroke-opacity': undefined,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

circle.setAttribute('stroke-opacity': '0.5');

attributes.applyTo(circle);

// not changed
circle.setAttribute('stroke-opacity': '0.5');
```

Attributes assigned a value of `null`
result in corresponding attributes being removed
when applying to an SVG element.

```javascript
var attributes = new SVGElementAttributes({
  'stroke-dasharray': null,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

circle.setAttribute('stroke-dasharray': '1 2 0.5');

circle.getAttribute('stroke-dasharray'); // "1 2 0.5"

attributes.applyTo(circle);

// attribute removed

circle.getAttribute('stroke-dasharray'); // null
```

Attributes should be specified in an object.

However, to facilitate the processing of user inputs,
the `SVGElementAttributes` class constructor can receive data in invalid formats (without throwing).

Invalid data are ignored.

### `has()`

Returns `true` if the queried attribute is present.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',
  'fill': null,
  'fill-opacity: undefined,
});

attributes.has('stroke'); // true
attributes.has('fill'); // true
attributes.has('fill-opacity'); // false
attributes.has('r'); // false
```

### `get()`

Returns the value of the specified attribute (a string or `null`).

Throws if the attribute has not been set.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',
  'stroke-opacity': 0.25,
  'fill': null,
  'fill-opacity': undefined,
});

attributes.get('stroke'); // "red"

// value converted to a string
attributes.get('stroke-opacity'); // "0.25"

attributes.get('fill'); null

attributes.get('fill-opacity'); // throws
attributes.get('r'); // throws
```

### `set()`

Set attributes.

```javascript
var attributes = new SVGElementAttributes();

attributes.set({
  'stroke': 'red',
  'stroke-width': 2,
  'fill': null,
  'fill-opacity': undefined,
});

attributes.get('stroke'); // "red"

// value converted to a string
attributes.get('stroke-width'); // "2"

attributes.get('fill'); // null

// ignores fill opacity
attributes.has('fill-opacity'); // false
```

Attributes are to be specified in an object.

However, to facilitate the processing of user inputs,
the `set()` method can receive data in invalid formats (without throwing).

Data in invalid formats are ignored.

### `applyTo()`

Applies the attributes to a given SVG element.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'blue',
  'stroke-width': 2.5,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

attributes.applyTo(circle);

circle.getAttribute('stroke'); // "blue"

// converts value to a string
circle.getAttribute('stroke-width'); // "2.5"
```

Attributes with values of `null`
result in corresponding attributes being removed
when applying to an SVG element.

```javascript
var attributes = new SVGElementAttributes({
  'stroke': null,
});

var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

circle.setAttribute('stroke', 'red');

circle.getAttribute('stroke'); // "red"

attributes.applyTo(circle);

// attribute was removed
circle.getAttribute('stroke'); // null
```

Attributes are applied independently of one another
(i.e., if setting one attribute were to throw,
the setting of other attributes would not be affected).

This method doesn't throw.

### `serialized()`

Returns the collection of attributes as a plain object
(that can be converted to a JSON string, for instance).

```javascript
var attributes = new SVGElementAttributes({
  'stroke': 'red',

  // will be converted to a string
  'stroke-width': 2,

  'fill': null,

  // will be omitted
  'fill-opacity': undefined,
});

attributes.serialized(); // {
//   "stroke": "red",
//   "stroke-width": "2",
//   "fill" null,
// }
```

## `class DrawingElementValues`

A collection of values (i.e., attributes and properties)
for an RNAcanvas drawing element.

```typescript
/**
 * RNAcanvas drawing elements generally fulfill this interface.
 **/
interface DrawingElement {
  readonly domNode: SVGElement;

  // any number of properties
  // ...
}
```

Attributes are defined at construction using an attributes dictionary sub-object.

Properties are defined at construction using property definition objects.

```javascript
var values = new DrawingElementValues({
  attributes: {
    'stroke': 'red',
    'stroke-width': 2,
  },
  basePadding: {
    value: 5,
    isValid: value => typeof value == 'number' && Number.isFinite(value),
  },
});

var ele = {
  domNode: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
};

values.applyTo(ele);

ele.domNode.getAttribute('stroke'); // "red"

// non-string attribute values are automatically converted to strings
ele.domNode.getAttribute('stroke-width'); // "2"

ele.basePadding; // 5
```

In the example above,
the `basePadding` property is initialized to a value of `5`.

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

### `set()`

Sets attributes and properties using a data object.

```javascript
var values = new DrawingElementValues({
  basePadding: {
    isValid: value => typeof value == 'number',
  },
  textContent: {
    isValid: value => typeof value == 'string',
  },
});

var ele = {
  domNode: document.createElementNS('http://www.w3.org/2000/svg', 'text'),
};

values.set({
  attributes: {
    'fill': 'green',
    'font-size': 12,
  },
  basePadding: 5,
  textContent: 'G',
});

values.applyTo(ele);

ele.domNode.getAttribute('fill'); // "green"

// non-string attribute values are automatically converted to strings
ele.domNode.getAttribute('font-size'); // "12"

ele.basePadding; // 5
ele.textContent; // "G"
```

Data object properties and attributes with values of `undefined` are ignored.

Note that setting an attribute to `null` results in the attribute being removed.

```javascript
var values = new DrawingElementValues({
  attributes: { 'stroke': 'red' },
});

var ele = {
  domNode: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
};

// remove the stroke attribute
values.set({
  attributes: { 'stroke': null },
});

values.applyTo(ele);

ele.domNode.getAttribute('stroke'); // null
```

Invalid values for properties are also ignored.

The validator functions defined at construction are used to check property values for validity.

```javascript
var values = new DrawingElementValues({
  basePadding: {
    value: 5,
    isValid: value => typeof value == 'number',
  },
});

var ele = {
  domNode: document.createElementNS('http://www.w3.org/2000/svg', 'text'),
};

// not a number
values.set({ basePadding: 'asdf' });

values.applyTo(ele);

// value was not changed
ele.basePadding; // 5
```

Unrecognized properties are also ignored.

(All properties must be defined at construction.)

```javascript
var values = new DrawingElementValues({
  basePadding: {
    isValid: value => typeof value == 'number',
  },
});

var ele = {
  domNode: document.createElementNS('http://www.w3.org/2000/svg', 'text'),
};

// base padding is defined (but text padding is not)
values.set({ textPadding: 10 });

values.applyTo(ele);

'textPadding' in ele; // false
```

To facilitate the processing of user inputs,
this method can receive data in any format (without throwing),
though data in invalid formats will be ignored.

### `applyTo()`

Applies the values to a drawing element.

Properties with values of `undefined` are not applied to drawing elements.

Values are applied independently of one another
(e.g., if setting one property or attribute were to cause an error to be thrown,
the setting of other properties and attributes would not be affected).

This method doesn't throw.

### `serialized()`

Returns the values as a plain object
(e.g., that can be converted to a JSON string
or input to the `set()` method).

```javascript
var values = new DrawingElementValues({
  attributes: {
    'stroke': 'red',
    'stroke-opacity': 0.25,
  },
  basePadding: {
    value: 2,
    isValid: () => true,
  },
  textContent: {
    value: 'C',
    isValid: () => true,
  },
});

// non-string attribute values are automatically converted to strings
values.serialized(); // {
//   attributes: {
//     'stroke': "red",
//     'stroke-opacity': "0.25",
//   },
//   basePadding: 2,
//   textContent: "C",
// }
```

Properties with unspecified values
or with a value of `undefined` are omitted.

```javascript
var values = new DrawingElementValues({
  basePadding: {
    // no value specified
    isValid: () => true,
  },
  textPadding: {
    value: undefined,
    isValid: () => true,
  },
  textContent: {
    value: null,
    isValid: () => true,
  },
});

// text content is the only property that is defined
values.serialized(); // {
//   attributes: {},
//   textContent: null,
// }
```
