import type { PropertyDefinition } from './PropertyDefinition';

export class DrawingElementValues {
  #propertyDefinitions: { [name: string]: PropertyDefinition } = {};

  constructor(definitions: { [name: string]: PropertyDefinition }) {
    Object.entries(definitions).forEach(([name, definition]) => {
      this.#propertyDefinitions[name] = definition;
    });
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
}

interface DrawingElement {
  readonly domNode: SVGElement;
}
