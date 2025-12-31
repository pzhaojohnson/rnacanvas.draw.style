import { SVGElementAttributes } from './SVGElementAttributes'

import { PropertyDefinition, isPropertyDefinition } from './PropertyDefinition';

import { isNonNullObject } from '@rnacanvas/value-check';

export class DrawingElementValues {
  #attributes = new SVGElementAttributes();

  #propertyDefinitions: { [name: string]: PropertyDefinition } = {};

  constructor(definitions?: ValueDefinitions | unknown) {
    if (definitions !== undefined) {
      if (!isNonNullObject(definitions)) {
        console.error('Drawing element value definitions must be specified in an object.');
      }
    }

    if (isNonNullObject(definitions)) {
      if (definitions.attributes !== undefined) {
        this.#attributes.set(definitions.attributes);
      }
    }

    if (isNonNullObject(definitions)) {
      Object.entries(definitions).forEach(([name, definition]) => {
        if (name === 'attributes') {
          // nothing to do here
        } else if (!isPropertyDefinition(definition)) {
          console.error(`${definition} is not a property definition object.`);
          console.error('Drawing element properties must be defined using a property definition object.');
        } else {
          this.#propertyDefinitions[name] = definition;
        }
      });
    }
  }

  /**
   * Values are to be set using a data object.
   *
   * Attributes data sub-object is to be keyed under "attributes" (if included).
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
      if (data.attributes !== undefined) {
        this.#attributes.set(data.attributes);
      }
    }

    if (isNonNullObject(data)) {
      Object.entries(data).forEach(([name, value]) => {
        if (name === 'attributes') {
          // nothing to do here
        } else if (value === undefined) {
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
   * This method also doesn't throw
   * and sets properties in an independent manner
   * (i.e., if setting one property were to throw an error,
   * the setting of other properties would not be affected).
   */
  applyTo(ele: DrawingElement): void {
    this.#attributes.applyTo(ele.domNode);

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

    serialization.attributes = this.#attributes.serialized();

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

/**
 * Attributes data sub-object should be keyed under "attributes" (if included).
 *
 * Properties should be specified using property definition objects.
 */
type ValueDefinitions = {
  [name: string]: NonNullObject | PropertyDefinition | unknown;
};

type NonNullObject = { [name: string]: unknown };
