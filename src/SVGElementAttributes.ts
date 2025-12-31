import { isNonNullObject } from '@rnacanvas/value-check';

/**
 * Represents a collection of attributes that can be applied to SVG elements.
 */
export class SVGElementAttributes {
  #attributes: { [name: string]: string } = {};

  /**
   * Data are supposed to be contained in an attributes data object.
   *
   * Data object properties with values of `undefined` or `null` are ignored.
   *
   * Other non-string values for attributes are converted to strings.
   *
   * This constructor will not throw.
   */
  constructor(data?: AttributesData | unknown) {
    if (data !== undefined) {
      this.set(data);
    }
  }

  /**
   * Returns `true` if the specified attribute is present.
   */
  has(name: string): boolean {
    return name in this.#attributes;
  }

  /**
   * Returns the value of the attribute.
   *
   * Throws if the attribute is not present.
   */
  get(name: string): string | never {
    if (name in this.#attributes) {
      return this.#attributes[name];
    } else {
      throw new Error(`SVG element attribute "${name}" has not been set.`);
    }
  }

  /**
   * Data are supposed to be contained in an attributes data object.
   *
   * Data object properties with values of `undefined` are ignored.
   *
   * Properties with values of `null` result in corresponding attributes being removed.
   *
   * Other non-string values for attributes are converted to strings.
   *
   * This method will not throw.
   */
  set(data: AttributesData | unknown): void {
    if (!isNonNullObject(data)) {
      console.error('SVG element attributes data must be contained in an object.');
    }

    if (isNonNullObject(data)) {
      Object.entries(data).forEach(([name, value]) => {
        if (value === undefined) {
          // ignore
        } else if (value === null) {
          delete this.#attributes[name];
        } else {
          this.#attributes[name] = `${value}`;
        }
      });
    }
  }

  applyTo(ele: SVGElement): void {
    Object.entries(this.#attributes).forEach(([name, value]) => {
      try {
        ele.setAttribute(name, value);
      } catch (error: unknown) {
        console.error(error);
        console.error(`Unable to set attribute "${name}" to "${value}" on SVG element ${ele}.`);
      }
    });
  }

  /**
   * Returns the serialized form of these SVG element attributes
   * (e.g., that can be converted to a JSON string).
   */
  serialized() {
    let serialization: { [name: string]: string } = {};

    Object.entries(this.#attributes).forEach(([name, value]) => {
      serialization[name] = value;
    });

    return serialization;
  }
}

type AttributesData = { [name: string]: unknown };
