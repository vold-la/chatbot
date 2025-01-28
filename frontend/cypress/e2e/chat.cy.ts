describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth');
  });

  it('should show login form by default', () => {
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="auth-submit"]').should('be.visible');
    cy.get('[data-testid="name-input"]').should('not.exist');
  });

  it('should successfully sign up a new user', () => {
    const testEmail = `test${Date.now()}@example.com`;

    cy.get('[data-testid="auth-toggle"]').click();
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type('testpass123');
    cy.get('[data-testid="auth-submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('[data-testid="chat-container"]').should('be.visible');
  });

  it('should successfully sign in an existing user', () => {
    const testEmail = `test${Date.now()}@example.com`;

    cy.get('[data-testid="auth-toggle"]').click();
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type('testpass123');
    cy.get('[data-testid="auth-submit"]').click();

    cy.visit('/auth');

    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type('testpass123');
    cy.get('[data-testid="auth-submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('[data-testid="chat-container"]').should('be.visible');
  });
});

describe('Chat Application', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/messages').as('getMessages');
    cy.intercept('POST', '/api/messages').as('sendMessage');
    cy.intercept('PUT', '/api/messages/*').as('editMessage');
    cy.intercept('DELETE', '/api/messages/*').as('deleteMessage');

    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpass123';

    cy.visit('/auth');
    cy.get('[data-testid="auth-toggle"]').click();
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="auth-submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('[data-testid="chat-container"]', { timeout: 10000 }).should('be.visible');
    cy.wait('@getMessages');
  });

  it('should send and receive messages', () => {
    const testMessage = 'Hello, this is a test message!';

    cy.get('[data-testid="message-input"]').should('be.visible').type(testMessage);
    cy.get('[data-testid="send-button"]').should('be.visible').click();

    cy.wait('@sendMessage');
    cy.wait('@getMessages');

    cy.get('[data-testid="message-content"]').should('contain', testMessage);
    cy.get('[data-testid="bot-message"]').should('exist');
  });

  it('should edit message', () => {
    const originalMessage = 'Original message';
    const editedMessage = 'Edited message';

    cy.get('[data-testid="message-input"]').should('be.visible').type(originalMessage);
    cy.get('[data-testid="send-button"]').should('be.visible').click();

    cy.wait('@sendMessage');
    cy.wait('@getMessages');

    cy.get('[data-testid="message-content"]').should('contain', originalMessage);

    cy.get('[data-testid="edit-button"]').first().click({ force: true });
    cy.get('[data-testid="edit-input"]').should('be.visible').clear().type(editedMessage);
    cy.get('[data-testid="save-edit"]').click();

    cy.wait('@editMessage');
    cy.get('[data-testid="message-content"]').should('contain', editedMessage);
    cy.get('[data-testid="edit-indicator"]').should('exist');
  });

  it('should delete message', () => {
    const testMessage = 'Message to delete';

    cy.get('[data-testid="message-input"]').should('be.visible').type(testMessage);
    cy.get('[data-testid="send-button"]').should('be.visible').click();

    cy.wait('@sendMessage');
    cy.wait('@getMessages');

    cy.get('[data-testid="message-content"]').should('contain', testMessage);

    cy.get('[data-testid="delete-button"]').first().click({ force: true });
    cy.wait('@deleteMessage');
    cy.get('[data-testid="deleted-message"]').should('exist');
  });

  it('should toggle chat window', () => {
    cy.get('[data-testid="chat-container"]').should('be.visible');

    cy.get('button[data-testid="toggle-chat"]').click({ force: true });
    cy.get('[data-testid="chat-container"]').should('not.be.visible');

    cy.get('button[data-testid="toggle-chat"]').click({ force: true });
    cy.get('[data-testid="chat-container"]').should('be.visible');
  });
});
