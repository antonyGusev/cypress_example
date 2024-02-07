import { BaseElement, IBaseGetData, IBaseGetDataResult, TAttrResult } from '../base.element';
import Chainable = Cypress.Chainable;

export interface IInputElement {
  sendKeys(data: string): void;
  getData(data: IBaseGetData): Chainable<IBaseGetDataResult>;
}

export class InputElement extends BaseElement {
  constructor(selector: string, name: string) {
    super(selector, name);
  }

  getData(data: IBaseGetData): Chainable<IBaseGetDataResult> {
    return this.initRoot().then(($el) => {
      const result: IBaseGetDataResult = {
        text: '',
        attr: { name: '', value: '' },
        position: { left: 0, top: 0 },
      };

      if (data.text) {
        result.text = `${$el.val()}`;
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
