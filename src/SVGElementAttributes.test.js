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

    var attributes = new SVGElementAttributes({ 'stroke': 'aliceblue', 'fill': null });

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    attributes.applyTo(ele);

    // ignores properties with values of null
    expect(ele.getAttribute('stroke')).toBe('aliceblue');
    expect(ele.getAttribute('fill')).toBe(null);
  });

  test('`set()`', () => {
    var attributes = new SVGElementAttributes();

    attributes.set({
      'stroke': '#44bca8',
      'fill': '#5bca55',
      'stroke-width': 8.15,
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

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    attributes.applyTo(ele);

    expect(ele.getAttribute('stroke')).toBe('#44bca8');
    expect(ele.getAttribute('fill')).toBe('#5bca55');

    // converts non-string values to strings
    expect(ele.getAttribute('stroke-width')).toBe('8.15');

    attributes.set({ 'stroke-dasharray': undefined });

    attributes.applyTo(ele);

    // ignores properties with values of undefined
    expect(ele.getAttribute('stroke-dasharray')).toBe(null);

    attributes.set({ 'stroke': null });

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    attributes.applyTo(ele);

    // properties with values of null result in corresponding attributes being removed
    expect(ele.getAttribute('stroke')).toBe(null);
    expect(ele.getAttribute('fill')).toBe('#5bca55');
  });

  test('`applyTo()`', () => {
    // empty attributes
    var attributes = new SVGElementAttributes();

    var ele = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    expect(() => attributes.applyTo(ele)).not.toThrow();

    attributes.set({ 'stroke': '#5ba887', 'fill': '#512eef', 'stroke-dasharray': '1 2 0.5' });

    attributes.applyTo(ele);

    expect(ele.getAttribute('stroke')).toBe('#5ba887');
    expect(ele.getAttribute('fill')).toBe('#512eef');
    expect(ele.getAttribute('stroke-dasharray')).toBe('1 2 0.5');
  });

  test('`serialized()`', () => {
    // empty attributes
    var attributes = new SVGElementAttributes();

    expect(attributes.serialized()).toStrictEqual({});

    attributes.set({ 'stroke': 'aliceblue', 'stroke-width': 5.1, 'stroke-dasharray': '1 0.5 0.1' });

    // converts non-string values to strings
    expect(attributes.serialized()).toStrictEqual({
      'stroke': 'aliceblue',
      'stroke-width': '5.1',
      'stroke-dasharray': '1 0.5 0.1',
    });
  });
});
