import type { PropertyDefinition } from './PropertyDefinition';

import { isNonNullObject } from '@rnacanvas/value-check';

export class DrawingElementValues {
  #propertyDefinitions: { [name: string]: PropertyDefinition } = {};

  constructor(definitions?: { [name: string]: PropertyDefinition }) {
    if (definitions) {
      Object.entries(definitions).forEach(([name, definition]) => {
        this.#propertyDefinitions[name] = definition;
      });
    }
  }

  /**
   * Values are to be set using a data object.
   *
   * Data in invalid formats are ignored (i.e., without throwing).
   *
   * Data object properties with values of `undefined` are ignored.
   *
   * Unrecognized data object properties are ignored
   * (all properties must be defined at construction).
   *
   * Invalid property values are ignored.
   *
   * Property values are checked using the validator functions defined at construction.
   */
  set(data: NonNullObject | unknown): void {
    if (!isNonNullObject(data)) {
      console.error('Drawing element values data must be specified in an object.');
    }

    if (isNonNullObject(data)) {
      Object.entries(data).forEach(([name, value]) => {
        if (value === undefined) {
          // ignore
        } else if (!(name in this.#propertyDefinitions)) {
          console.error(`Unrecognized property "${name}".`);
        } else if (!this.#propertyDefinitions[name].isValid(value)) {
          console.error(`Invalid value ${value} for property "${name}".`);
        } else {
          this.#propertyDefinitions[name].value = value;
        }
      });
    }
  }

  /**
   * Properties with values of `undefined` are not applied to elements.
   *
   * This method also will not throw
   * and sets properties in an independent manner
   * (i.e., if setting one property throws an error,
   * the setting of other properties won't be affected).
   */
  applyTo(ele: DrawingElement): void {
    Object.entries(this.#propertyDefinitions).forEach(([name, definition]) => {
      if (definition.value !== undefined) {
        try {
          (ele as any)[name] = definition.value;
        } catch (error: unknown) {
          console.error(error);
          console.error(`Unable to set property "${name}" to ${definition.value} on drawing element ${ele}.`);
        }
      }
    });
  }

  /**
   * Returns these values as a plain object
   * (e.g., that can be converted to a JSON string
   * or input to the `set()` method).
   */
  serialized(): NonNullObject {
    let serialization: NonNullObject = {};

    Object.entries(this.#propertyDefinitions).forEach(([name, definition]) => {
      if (definition.value !== undefined) {
        serialization[name] = definition.value;
      }
    });

    return serialization;
  }
}

interface DrawingElement {
  readonly domNode: SVGElement;
}

type NonNullObject = { [name: string]: unknown };
