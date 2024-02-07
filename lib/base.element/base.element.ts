import { AbstractElement, TAttrGet } from '../base.abstractions';
import Chainable = Cypress.Chainable;

export interface IBaseGetData {
  text?: boolean;
  attr?: TAttrGet;
  position?: boolean;
}

export type TAttrResult = { name: string; value: string };
export type TPositionResult = { left: number; top: number };

export interface IBaseGetDataResult {
  text: string;
  textArr?: string[];
  attr: { name: string; value: string };
  attrArr?: { name: string; value: string }[];
  position: { left: number; top: number };
}

export interface IBaseElement {
  clickOn(data?: any): void;
  sendKeys(data: string): void;
  getData(data: IBaseGetData): Chainable<IBaseGetDataResult>;
}

export class BaseElement extends AbstractElement implements IBaseElement {
  constructor(selector: string, name: string) {
    super(selector, name);
  }

  clickOn(data?: any): void {
    this.initRoot().click();
  }

  sendKeys(data: string): void {
    this.initRoot().type(data);
  }

  getData(data: IBaseGetData): Chainable<IBaseGetDataResult> {
    return this.initRoot().then(($el) => {
      const result: IBaseGetDataResult = {
        text: '',
        attr: { name: '', value: '' },
        position: { left: 0, top: 0 },
      };

      if (data.text) {
        result.text = $el.text();
      }

      if (data.attr && data.attr !== 'ALL') {
        result.attr = this.getAttributes($el, data.attr) as TAttrResult;
      }

      if (data.attr && data.attr === 'ALL') {
        result.attrArr = this.getAttributes($el, data.attr) as TAttrResult[];
      }

      if (data.position) {
        result.position = $el.position();
      }

      return cy.wrap(result);
    });
  }
}
