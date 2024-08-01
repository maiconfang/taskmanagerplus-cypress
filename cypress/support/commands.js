// cypress/support/commands.js

import 'cypress-axe';

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#loginButton').click();
});

Cypress.Commands.add('checkFrontend', () => {
  const frontendUrl = Cypress.config('baseUrl');
  
  cy.request({
    url: frontendUrl,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Frontend is not accessible');
    }
  });
});

Cypress.Commands.add('checkBackend', () => {
  const apiConfig = Cypress.env('apiConfig');
  const { url, auth, body } = apiConfig;

  cy.request({
    method: 'POST',
    url: url,
    headers: {
      'Authorization': 'Basic ' + btoa(`${auth.username}:${auth.password}`), // Basic Auth
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Backend is not accessible');
    }
  });
});


