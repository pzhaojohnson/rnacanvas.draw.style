/**
 * @jest-environment jsdom
 */

import { DrawingElementValues } from './DrawingElementValues';

import { isString } from '@rnacanvas/value-check';

import { isFiniteNumber, isPositiveFiniteNumber } from '@rnacanvas/value-check';

describe('`class DrawingElementValues`', () => {
  test('`set()`', () => {
    var values = new DrawingElementValues();

    // ignores data in invalid formats
    expect(() => values.set()).not.toThrow();
    expect(() => values.set(undefined)).not.toThrow();
    expect(() => values.set(null)).not.toThrow();
    expect(() => values.set(true)).not.toThrow();
    expect(() => values.set(1)).not.toThrow();
    expect(() => values.set('asdf')).not.toThrow();

    var values = new DrawingElementValues({
      basePadding: { value: 2, isValid: isFiniteNumber },
      textPadding: { value: 10, isValid: isPositiveFiniteNumber },
    });

    var ele = new DrawingElementMock();

    values.set({ basePadding: 100, textPadding: 200 });

    values.applyTo(ele);

    // sets properties
    expect(ele.basePadding).toBe(100);
    expect(ele.textPadding).toBe(200);

    values.set({ basePadding: 'asdf' }); // not a number
    values.set({ textPadding: Infinity }); // not a finite number

    values.applyTo(ele);

    // ignores invalid property values
    expect(ele.basePadding).toBe(100); // unchanged
    expect(ele.textPadding).toBe(200); // unchanged

    var values = new DrawingElementValues({
      prop1: { isValid: () => true },
    });

    values.set({
      prop1: undefined,
      prop2: 5, // property not defined
    });

    values.applyTo(ele);

    // ignores data object properties with values of undefined
    expect('prop1' in ele).toBe(false);

    // ignores unrecognized properties
    expect('prop2' in ele).toBe(false);

    values.set({ prop1: 10 });

    values.applyTo(ele);

    // property "prop1" can be set
    expect(ele.prop1).toBe(10);
  });

  test('`applyTo()`', () => {
    var values = new DrawingElementValues({
      basePadding: { value: -2, isValid: isFiniteNumber },
      textPadding: { value: 10, isValid: isPositiveFiniteNumber },
    });

    var ele = new DrawingElementMock();

    values.applyTo(ele);

    expect(ele.basePadding).toBe(-2);
    expect(ele.textPadding).toBe(10);

    var values = new DrawingElementValues({
      magnitude: { value: undefined, isValid: () => true },
      direction: { isValid: () => true },
    });

    // does not apply properties with values of undefined
    expect('magnitude' in ele).toBe(false);
    expect('direction' in ele).toBe(false);

    var values = new DrawingElementValues({
      textPadding: { value: 3.5, isValid: isFiniteNumber },
      basePadding: { value: -2, isValid: isFiniteNumber },
      textContent: { value: 'C', isValid: isString },
    });

    var ele = new DrawingElementMock();

    Object.defineProperty(ele, 'basePadding', {
      get: function () { throw new Error('Not implemented.'); },
      set: function () { throw new Error('Not implemented.'); }
    });

    expect(() => ele.basePadding = -2).toThrow();

    // does not throw
    expect(() => values.applyTo(ele)).not.toThrow();

    // were still set
    expect(ele.textPadding).toBe(3.5);
    expect(ele.textContent).toBe('C');
  });
});

class DrawingElementMock {
  domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
}
