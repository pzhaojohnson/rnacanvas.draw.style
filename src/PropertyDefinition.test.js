import { isPropertyDefinition } from './PropertyDefinition';

test('`function isPropertyDefinition()`', () => {
  expect(isPropertyDefinition({ isValid: () => true })).toBe(true);

  // value is not an object
  expect(isPropertyDefinition(undefined)).toBe(false);
  expect(isPropertyDefinition(null)).toBe(false);
  expect(isPropertyDefinition(true)).toBe(false);
  expect(isPropertyDefinition(1)).toBe(false);
  expect(isPropertyDefinition('asdf')).toBe(false);

  // value is missing validator function
  expect(isPropertyDefinition({})).toBe(false);
  expect(isPropertyDefinition([])).toBe(false);

  // validator function is not actually a function
  expect(isPropertyDefinition({ isValid: true })).toBe(false)
  expect(isPropertyDefinition({ isValid: {} })).toBe(false)
});
