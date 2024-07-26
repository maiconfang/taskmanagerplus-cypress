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
  }
  
  export default LoginPage;
  