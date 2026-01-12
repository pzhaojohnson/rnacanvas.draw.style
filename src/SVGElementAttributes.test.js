/**
 * @jest-environment jsdom
 */

import { SVGElementAttributes } from './SVGElementAttributes';

describe('`class SVGElementAttributes`', () => {
  test('`constructor()`', () => {
    // empty object
    expect(() => new SVGElementAttributes({})).not.toThrow();

    // non-empty object
    expect(() => new SVGElementAttributes({ 'stroke': 'red', 'stroke-width': 2 })).not.toThrow();

    // missing data
    expect(() => new SVGElementAttributes()).not.toThrow();

    // data not contained in an object
    expect(() => new SVGElementAttributes(undefined)).not.toThrow();
    expect(() => new SVGElementAttributes(null)).not.toThrow();
    expect(() => new SVGElementAttributes(true)).not.toThrow();
    expect(() => new SVGElementAttributes(2)).not.toThrow();
    expect(() => new SVGElementAttributes('asdf')).not.toThrow();

    var attributes = new SVGElementAttributes({ 'stroke': undefined, 'fill': 'aliceblue' });

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    attributes.applyTo(ele);

    // ignores properties with values of undefined
    expect(ele.getAttribute('stroke')).toBe(null);

    expect(ele.getAttribute('fill')).toBe('aliceblue');

    var attributes = new SVGElementAttributes({ 'fill': null });

    expect(ele.getAttribute('fill')).not.toBe(null);

    attributes.applyTo(ele);

    // properties with values of null cause corresponding attributes to be removed
    expect(ele.getAttribute('fill')).toBe(null);
  });

  test('`has()`', () => {
    var attributes = new SVGElementAttributes({ 'stroke': 'red', 'fill': null, 'stroke-opacity': undefined });

    expect(attributes.has('stroke')).toBe(true);

    // has a value of null
    expect(attributes.has('fill')).toBe(true);

    expect(attributes.has('stroke-opacity')).toBe(false);
    expect(attributes.has('stroke-dasharray')).toBe(false);
  });

  test('`get()`', () => {
    var attributes = new SVGElementAttributes({ 'stroke': '#bba671', 'stroke-opacity': null });

    expect(attributes.get('stroke')).toBe('#bba671');

    expect(attributes.get('stroke-opacity')).toBe(null);

    // attribute not present
    expect(() => attributes.get('fill')).toThrow();
  });

  test('`set()`', () => {
    var attributes = new SVGElementAttributes();

    attributes.set({
      'stroke': '#44bca8',
      'fill': '#5bca55',
      'stroke-width': 8.15,
      'stroke-opacity': null,
      'stroke-dasharray': undefined,
    });

    expect(attributes.serialized()).toStrictEqual({
      'stroke': '#44bca8',
      'fill': '#5bca55',

      // converts value to string
      'stroke-width': '8.15',

      'stroke-opacity': null,

      // ignores stroke dash array
    });

    // empty object
    attributes.set({});

    // missing data
    attributes.set();

    // data are not contained in an object
    attributes.set(undefined);
    attributes.set(null);
    attributes.set(true);
    attributes.set(5);
    attributes.set('qwer');

    // ignores invalid data
    expect(attributes.serialized()).toStrictEqual({
      'stroke': '#44bca8',
      'fill': '#5bca55',
      'stroke-width': '8.15',
      'stroke-opacity': null,
    });
  });

  test('`applyTo()`', () => {
    // empty attributes
    var attributes = new SVGElementAttributes();

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    expect(() => attributes.applyTo(ele)).not.toThrow();

    attributes.set({ 'stroke': '#5ba887', 'stroke-width': 3.5, 'fill': null, 'stroke-dasharray': '1 2 0.5' });

    ele.setAttribute('fill', 'red');
    expect(ele.getAttribute('fill')).toBe('red');

    attributes.applyTo(ele);

    expect(ele.getAttribute('stroke')).toBe('#5ba887');

    // converts value to string
    expect(ele.getAttribute('stroke-width')).toBe('3.5');

    // removes attribute
    expect(ele.getAttribute('fill')).toBe(null);

    expect(ele.getAttribute('stroke-dasharray')).toBe('1 2 0.5');
  });

  test('`serialized()`', () => {
    // empty attributes
    var attributes = new SVGElementAttributes();

    expect(attributes.serialized()).toStrictEqual({});

    attributes.set({
      'stroke': 'aliceblue',
      'stroke-width': 5.1,
      'stroke-dasharray': '1 0.5 0.1',
      'fill-opacity': null,
      'fill': undefined,
    });

    expect(attributes.serialized()).toStrictEqual({
      'stroke': 'aliceblue',

      // converts value to string
      'stroke-width': '5.1',

      'stroke-dasharray': '1 0.5 0.1',

      // includes null values
      'fill-opacity': null,

      // omits fill attribute
    });
  });
});
