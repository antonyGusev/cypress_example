import { IBaseGetData, TAttrResult, TPositionResult } from '../base.element';
import Chainable = Cypress.Chainable;

import { AbstractElement } from '../base.abstractions';

export type TListElemToFilter = 'All' | 'Active' | 'Completed' | 'Clear completed';

export interface IListElemToClick {
  toCheck?: string;
  toDelete?: string;
}

export interface IListElemGetData {
  option: 'root' | string;
  data: IBaseGetData;
}

export interface IListElemGetDataResult {
  text: string;
  textArr?: string[];
  attr: TAttrResult;
  attrArr?: TAttrResult[];
  position: TPositionResult;
}

export interface IListElement {
  clickOn(data: IListElemToClick | TListElemToFilter): void;
  getData(data: IListElemGetData): Chainable<IListElemGetDataResult>;
}

export class ListElement extends AbstractElement implements IListElement {
  constructor(selector: string, name: string) {
    super(selector, name);
  }

  getData({ option, data }: IListElemGetData): Chainable<IListElemGetDataResult> {
    if (option === 'root') {
      return this.getParentData(data);
    } else {
      return this.getChidrenData({ option, data });
    }
  }

  clickOn(data: IListElemToClick | TListElemToFilter): void {
    const isDataString = typeof data === 'string';

    if (isDataString) {
      this.initRoot().children().contains(data).click();
    } else if (!isDataString && 'toCheck' in data && data.toCheck) {
      this.initRoot().children('li').contains(data.toCheck!).parent().find('input[type=checkbox]').check();
    } else if (!isDataString && 'toDelete' in data && data.toDelete) {
      this.initRoot().children('li').contains(data.toDelete!).siblings('button').invoke('show').click();
    }
  }

  /**
   *
   *  @Private_methods
   */

  private resultObj(): IListElemGetDataResult {
    return {
      text: '',
      attr: { name: '', value: '' },
      position: { left: 0, top: 0 },
    };
  }

  private getParentData(data: IBaseGetData) {
    const result = this.resultObj();

    return this.initRoot().then(($el) => {
      if (data.text) {
        result.textArr = Array.from($el.children('li')).map(li => `${li.textContent}`);
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

      cy.log('wrapped result', JSON.stringify(result))

      return cy.wrap(result);
    });
  }

  private getChidrenData({ option, data }: IListElemGetData) {
    const result = this.resultObj();

    return this.initRoot().then(($el) => {
      const child = $el.children(`li:contains(${option})`);

      if (data.text) {
        result.text = child.text();
      }

      if (data.attr && data.attr !== 'ALL') {
        result.attr = this.getAttributes(child, data.attr) as TAttrResult;
      }

      if (data.attr && data.attr === 'ALL') {
        result.attrArr = this.getAttributes(child, data.attr) as TAttrResult[];
      }

      if (data.position) {
        result.position = child.position();
      }

      cy.log('wrapped result', JSON.stringify(result))

      return cy.wrap(result);
    });
  }
}
