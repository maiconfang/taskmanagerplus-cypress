import InitialPage from '../../page-objects/initialPage';
import LoginPage from '../../page-objects/loginPage';
import DashboardPage from '../../page-objects/dashboardPage';

describe('Login Tests', () => {
  const initialPage = new InitialPage();
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  // Run before each test
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
      // cy.checkAccessibility(); // Optional: Check accessibility
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
});
