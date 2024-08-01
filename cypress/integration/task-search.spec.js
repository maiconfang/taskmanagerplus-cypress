// cypress/integration/task-search.spec.js
// import TaskSearchPage from '../../support/TaskSearchPage';
import TaskSearchPage from '../page-objects/TaskSearchPage';
import LoginPage from '../page-objects/loginPage';
import DashboardPage from '../page-objects/dashboardPage';
import 'cypress-real-events/support';

describe('Task Search Page', () => {
    const loginPage = new LoginPage();
    const dashboardPage = new DashboardPage();
    const taskSearchPage = new TaskSearchPage();

    // Run before all tests
    before(() => {
        cy.checkFrontend();
        cy.checkBackend();
        
    });

    beforeEach(() => {
        loginPage.visit(); // Navigate to the login page before each test
        cy.fixture('loginCredentials').then((credentials) => {
            loginPage.enterUsername(credentials.validUser); // Enter valid username
            loginPage.enterPassword(credentials.validPassword); // Enter valid password
            loginPage.clickLoginButton(); // Click login button
            cy.url().should('include', '/app'); // Check if the URL includes /app

            // Verify the presence of specific elements on the dashboard
            dashboardPage.isUserLinkPresent(); // Check if user link is present
            dashboardPage.isLogoutButtonPresent(); // Check if logout button is present
        });
        cy.visit('/app/task'); // Navigate to the task search page before each test
    });


    it('should search for a task by title', () => {
        taskSearchPage.enterTitle('Task 13');
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', 'Task 13');
    });

    it('should search for a task by description', () => {
        taskSearchPage.enterDescription('Description for Task 13');
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', 'Description for Task 13');
    });

    it('should search for a task by due date', () => {
        taskSearchPage.enterDueDate('2024-07-08');
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', '2024-07-088');
    });

    it('should search for a task by completed and description', () => {
        taskSearchPage.enterDescription('Description for Task 9');
        taskSearchPage.selectCompleted();
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', 'Yes');
    });

    it('should search for a task by not completed and title', () => {
        taskSearchPage.enterTitle('Task 12');
        taskSearchPage.selectNotCompleted();
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', 'No');
    });

    it('should display edit and delete buttons when searching by description on the task consultation screen', () => {
        taskSearchPage.enterDescription('Description for Task 9');
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', 'Description for Task 9');
        cy.get('i.fas.fa-edit').should('be.visible'); // Verify the presence of the edit button
        cy.get('i.fas.fa-trash').should('be.visible'); // Verify the presence of the delete button
    });

});
