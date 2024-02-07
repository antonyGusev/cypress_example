/// <reference types="cypress" />

export const browser = {
  goTo(url: string) {
    return cy.visit(url)
  },

  reload(isForce?: boolean) {
    return isForce ? cy.reload(isForce) : cy.reload()
  }
};
