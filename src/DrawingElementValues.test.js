/**
 * @jest-environment jsdom
 */

import { DrawingElementValues } from './DrawingElementValues';

import { isString } from '@rnacanvas/value-check';

import { isFiniteNumber, isPositiveFiniteNumber } from '@rnacanvas/value-check';

describe('`class DrawingElementValues`', () => {
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
