import { BaseAbstraction } from './base.abstraction';
import Chainable = Cypress.Chainable;

export type TAttrGet = 'class' | 'href' | 'alt' | 'src' | 'width' | 'height' | 'lang' | 'title' | 'type' | 'value' | 'ALL';

export abstract class AbstractElement extends BaseAbstraction {
  constructor(selector: string, name: string) {
    super(selector, name);
  }

  protected initRoot(): Chainable<JQuery<HTMLElement>> {
    cy.get(this.selector, { timeout: 30000 }).should('be.visible');

    return cy.get(this.selector);
  }

  protected getAttributes($node: JQuery<HTMLElement>, attrToGet: TAttrGet) {
    const attr = { name: '', value: '' };
    const attributes = Array.from($node.get(0).attributes);

    if (attrToGet === 'ALL') {
      return attributes.map((node) => {
        attr.name = node.name;
        attr.value = node.value;
        return attr;
      });
    } else {
      attr.name = attrToGet;
      attr.value = `${$node.attr(attrToGet)}`;
      return attr;
    }
  }
}
