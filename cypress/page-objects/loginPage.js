
import 'cypress-xpath'; // Import the cypress-xpath library
import 'cypress-real-events/support';

class LoginPage {
  visit() {
    cy.visit('/'); // Visit the home page
    cy.get('#navbar_login_link').click(); // Click on the LOGIN menu item by ID
  }

  enterUsername(username) {
    cy.get('#login_username').type(username); // Type the username
  }

  enterPassword(password) {
    cy.get('#login_password').type(password); // Type the password
  }

  clickLoginButton() {
    cy.get('#login_submit').click(); // Click the login button
  }

  getErrorMessage() {
    return cy.get('.toast-error .toast-title'); // Get the error message element
  }

  getErrorMessageText() {
    return cy.get('.toast-message'); // Get the error message text
  }

  getErrorMessagesInputs() {
    return cy.get('#error-messages'); // Get the error messages
  }

  clickInputLogin() {
    cy.get('#login_username').click(); // Click the login input
  }

  clickInputPassword() {
    cy.get('#login_password').click(); // Click the password input
  }

  isLoginButtonDisabled() {
    cy.get('#login_submit').should('be.disabled'); // Check if the login button is disabled
  }

  getUsernameField() {
    return cy.get('#login_username'); // Get the username input field
  }

  getPasswordField() {
    return cy.get('#login_password'); // Get the password input field
  }

  getLoginButton() {
    return cy.get('#login_submit'); // Get the login button
  }


  clickLabelTitle() {
    cy.get('#login_page_title_label').click(); // Click the login page title
  }


}

export default LoginPage;
