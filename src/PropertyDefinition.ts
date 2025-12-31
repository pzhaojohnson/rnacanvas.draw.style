import { isNonNullObject } from '@rnacanvas/value-check';

export type PropertyDefinition = {
  value?: unknown;

  /**
   * A validator function for property values.
   *
   * Returns `true` (or something truthy) for valid property values.
   */
  isValid: (value: unknown) => boolean | unknown;
};

export function isPropertyDefinition(value: unknown): value is PropertyDefinition {
  return (
    isNonNullObject(value)
    && typeof value.isValid == 'function'
  );
}
