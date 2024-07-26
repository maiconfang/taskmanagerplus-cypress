import InitialPage from '../../page-objects/initialPage';
import LoginPage from '../../page-objects/loginPage';
import DashboardPage from '../../page-objects/dashboardPage';

describe('Login Tests', () => {
  const initialPage = new InitialPage();
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    loginPage.visit(); // Navigate to the login page before each test
  });

  it('should log in successfully with valid credentials', () => {
    cy.fixture('loginCredentials').then((credentials) => {
      loginPage.enterUsername(credentials.validUser);
      loginPage.enterPassword(credentials.validPassword);
      loginPage.clickLoginButton();
      cy.url().should('include', '/app'); // Check if the URL includes /app
      
      // Verify the presence of specific elements on the dashboard
     // dashboardPage.isUserLinkPresent();
    //  dashboardPage.isLogoutButtonPresent();
    });
  });

  it('should show error with invalid credentials', () => {
    cy.fixture('loginCredentials').then((credentials) => {
      loginPage.enterUsername(credentials.invalidUser);
      loginPage.enterPassword(credentials.invalidPassword);
      loginPage.clickLoginButton();
      loginPage.getErrorMessage().should('be.visible').and('contain', 'Opps!!'); // Check for error message
    });
  });
});
