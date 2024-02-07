import { BaseAbstraction } from './base.abstraction';

export abstract class AbstractComponent extends BaseAbstraction {
  constructor(selector: string, name: string) {
    super(selector, name);
  }

  protected initChild(child: any, selector: string, name: string) {
    return new child(selector, name);
  }

  sendKeys(data: Record<string, any>): void {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, any>)[key].sendKeys(value);
    }
  }

  clickOn(data: Record<string, any>): void {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, any>)[key].clickOn(value);
    }
  }

  getData<T extends Record<string, any>>(data: Record<string, any>): T {
    const values = { ...data };

    for (const [key, value] of Object.entries(data)) {
      values[key] = (this as Record<string, any>)[key].getData(value);
    }

    return values as T;
  }
}
