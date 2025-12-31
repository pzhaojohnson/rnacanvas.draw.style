export type PropertyDefinition = {
  value?: unknown;

  /**
   * A validator function for property values.
   *
   * Returns `true` (or something truthy) for valid property values.
   */
  isValid: (value: unknown) => boolean | unknown;
};
