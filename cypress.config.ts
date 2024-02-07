import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://example.cypress.io',
    // specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {},
  },
});
