import InitialPage from '../page-objects/initialPage';
import LoginPage from '../page-objects/loginPage';
import DashboardPage from '../page-objects/dashboardPage';
import 'cypress-real-events/support';

describe('Login Tests', () => {
  const initialPage = new InitialPage();
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();


  let apiIsWorking = false;

  // Run before all tests
  before(() => {
    cy.checkFrontend();
    cy.checkBackend();
  });

  beforeEach(() => {
    loginPage.visit(); // Navigate to the login page before each test
  });


  // Test case: Login with valid credentials
  it('should log in successfully with valid credentials', () => {
    cy.fixture('loginCredentials').then((credentials) => {
      loginPage.enterUsername(credentials.validUser); // Enter valid username
      loginPage.enterPassword(credentials.validPassword); // Enter valid password
      loginPage.clickLoginButton(); // Click login button
      cy.url().should('include', '/app'); // Check if the URL includes /app

      // Verify the presence of specific elements on the dashboard
      dashboardPage.isUserLinkPresent(); // Check if user link is present
      dashboardPage.isLogoutButtonPresent(); // Check if logout button is present
    });
  });

  // Test case: Login with invalid credentials
  it('should show error with invalid credentials', () => {
    cy.fixture('loginCredentials').then((credentials) => {
      loginPage.enterUsername(credentials.invalidUser); // Enter invalid username
      loginPage.enterPassword(credentials.invalidPassword); // Enter invalid password
      loginPage.clickLoginButton(); // Click login button
      loginPage.getErrorMessage().should('be.visible').and('contain', 'Opps!!'); // Check for error message
    });
  });

  // Test case: Login with empty username and password
  it('should show error when username and password are empty', () => {
    loginPage.clickInputLogin(); // Click the login input
    loginPage.clickInputPassword(); // Click the password input
    loginPage.clickInputLogin(); // Click the login input
    loginPage.isLoginButtonDisabled();
  });

  // Test case: Login with empty login and password
  it('should show error when login and password is empty', () => {

    loginPage.clickInputLogin(); // Click the login input
    loginPage.clickInputPassword(); // Click the password input
    loginPage.clickInputLogin(); // Click the login input

    loginPage.getErrorMessagesInputs().should('contain', 'The login is required');
    loginPage.clickLabelTitle(); // Click the login page title

    loginPage.getErrorMessagesInputs().then((errorMessages) => {
      const message = errorMessages.text(); // Gets the text of the error messages
      cy.log(message); // Logs the message in Cypress log
      console.log(message); // Prints the message in the console
    });

  });

  // Test case: Tab order is correct
  it('should have correct tab order', () => {

    // Fill in the login and password fields
    loginPage.enterUsername('testuser'); // Enter a test username
    loginPage.enterPassword('testpassword'); // Enter a test password

    loginPage.getUsernameField().focus();
    cy.realPress('Tab'); // Press Tab key
    loginPage.getPasswordField().should('be.focused'); // Password field should be focused

    cy.realPress('Tab'); // Press Tab key again
    loginPage.getLoginButton().should('be.focused'); // Login button should be focused
  });


  // Test case: SQL injection
  it('should handle SQL injection attempts', () => {
    loginPage.enterUsername("'; DROP TABLE cypress_test;--"); // Enter SQL injection in username
    loginPage.enterPassword('anyPassword'); // Enter any password
    loginPage.clickLoginButton(); // Click login button
    loginPage.getErrorMessage().should('be.visible').and('contain', 'Opps!!'); // Check for error message
    loginPage.getErrorMessageText().should('be.visible').and('contain', 'Invalid username or password');

    loginPage.getErrorMessageText().then((errorMessages) => {
      const message = errorMessages.text(); // Gets the text of the error messages
      cy.log(message); // Logs the message in Cypress log
      console.log(message); // Prints the message in the console
    });
  });

  // Test case: XSS attack
  it('should handle XSS attempts', () => {
    loginPage.enterUsername('<script>alert("XSS")</script>'); // Enter XSS script in username
    loginPage.enterPassword('anyPassword'); // Enter any password
    loginPage.clickLoginButton(); // Click login button
    loginPage.getErrorMessage().should('be.visible').and('contain', 'Opps!!'); // Check for error message
    loginPage.getErrorMessageText().should('be.visible').and('contain', 'Invalid username or password');
  });

  // Test case: Excessively long login
  it('should handle excessively long login', () => {
    const longUsername = 'm'.repeat(55); // Create a long login
    loginPage.enterUsername(longUsername); // Enter long login
    loginPage.enterPassword('anyPassword'); // Enter any password
    loginPage.getErrorMessagesInputs().should('be.visible').and('contain', 'The login may have at most 50 characters'); // Check for error message
  });

  // Test case: Excessively long password
  it('should handle excessively long password', () => {
    const longPassword = 'b'.repeat(55); // Create a long username
    loginPage.enterUsername('anyLogin'); // Enter any login
    loginPage.enterPassword(longPassword); // Enter long password
    loginPage.clickLabelTitle(); // Click the login page title
    loginPage.getErrorMessagesInputs().should('be.visible').and('contain', 'The password may have at most 30 characters'); // Check for error message
  });

  // Test case: Mobile compatibility
  it('should be responsive and functional on mobile devices', () => {
    cy.fixture('loginCredentials').then((credentials) => {
      cy.viewport('iphone-6'); // Set the viewport to a mobile device

      loginPage.enterUsername(credentials.validUser); // Enter valid username
      loginPage.enterPassword(credentials.validPassword); // Enter valid password
      loginPage.clickLoginButton(); // Click login button
      cy.url().should('include', '/app'); // Check if the URL includes /app
    });
  });


});
