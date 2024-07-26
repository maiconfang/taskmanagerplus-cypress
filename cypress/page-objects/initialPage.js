class InitialPage {
    constructor() {
      // Define selectors for elements on the initial page
      this.loginLink = '#navbar_login_link'; // ID for the login link
    }
  
    // Method to navigate to the login page
    clickLogin() {
      cy.get(this.loginLink).click();
    }
  }
  
  export default InitialPage;
  