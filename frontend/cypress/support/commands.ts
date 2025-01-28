/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="auth-submit"]').click();
});

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', () => {
  return false;
});
