class DashboardPage {
    constructor() {
      this.userLink = '#nav-link-user'; // ID for the user link
      this.logoutButton = '#btn-logout'; // ID for the logout button
    }
  
    isUserLinkPresent() {
      return cy.get(this.userLink).should('be.visible');
    }
  
    isLogoutButtonPresent() {
      return cy.get(this.logoutButton).should('be.visible');
    }
  }
  
  export default DashboardPage;
  