import { isNonNullObject } from '@rnacanvas/value-check';

/**
 * Represents a collection of attributes that can be applied to SVG elements.
 */
export class SVGElementAttributes {
  #attributes: { [name: string]: string } = {};

  /**
   * Data are supposed to be contained in an attributes data object.
   *
   * Non-string attribute values are converted to strings.
   *
   * This constructor will not throw.
   */
  constructor(data?: AttributesData | unknown) {
    if (data !== undefined) {
      this.set(data);
    }
  }

  /**
   * Data are supposed to be contained in an attributes data object.
   *
   * Non-string attribute values are converted to strings.
   *
   * This method will not throw.
   */
  set(data: AttributesData | unknown): void {
    if (!isNonNullObject(data)) {
      console.error('SVG element attributes data must be contained in an object.');
    }

    if (isNonNullObject(data)) {
      Object.entries(data).forEach(([name, value]) => {
        this.#attributes[name] = `${value}`;
      });
    }
  }

  applyTo(ele: SVGElement): void {
    Object.entries(this.#attributes).forEach(([name, value]) => {
      ele.setAttribute(name, value);
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
