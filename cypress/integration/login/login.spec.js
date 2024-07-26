describe('Login Tests', () => {
    // Runs before each test in this block
    beforeEach(() => {
      cy.visit('/'); // Visit the home page
      //   cy.get('a').contains('LOGIN').click(); // Click on the LOGIN menu item
      cy.get('#navbar_login_link').click(); // Click on the LOGIN menu item by ID
    });
  
    it('should log in successfully with valid credentials', () => {
      cy.get('#login_username').type('luna.moon@maif.com'); // Type the valid username
      cy.get('#login_password').type('123'); // Type the valid password
      cy.get('#login_submit').click(); // Click the login button
      cy.url().should('include', '/app'); // Check if the URL includes /dashboard
    });
  
    it('should show error with invalid credentials', () => {
      cy.get('#login_username').type('invalidUser'); // Type an invalid username
      cy.get('#login_password').type('invalidPassword'); // Type an invalid password
      cy.get('#login_submit').click(); // Click the login button
      cy.get('.toast-error .toast-title') // Select the element with the error message
      .should('be.visible') // Check that it is visible
      .and('contain', 'Opps!!'); // Check that it contains the correct text
    });
  });
  