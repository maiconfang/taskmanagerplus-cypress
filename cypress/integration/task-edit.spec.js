// cypress/integration/task-search.spec.js
import TaskSearchPage from '../page-objects/TaskSearchPage';
import LoginPage from '../page-objects/loginPage';
import TaskFormPage from '../page-objects/taskFormPage';
import DashboardPage from '../page-objects/dashboardPage';
import 'cypress-real-events/support';
import { it } from 'mocha';


describe('Task Edit Page', () => {
    const loginPage = new LoginPage();
    const dashboardPage = new DashboardPage();
    const taskSearchPage = new TaskSearchPage();
    const taskFormPage = new TaskFormPage();
    let token;


    // Run before all tests
    before(() => {
        cy.checkFrontend();
        cy.checkBackend();

        // Get the authentication token using the fixture credentials and environment variables
        const apiConfig = Cypress.env('apiConfig');

        cy.request({
            method: 'POST',
            url: apiConfig.url,
            form: true, // Make the request as x-www-form-urlencoded
            body: {
                username: apiConfig.body.username,
                password: apiConfig.body.password,
                grant_type: apiConfig.body.grant_type
            },
            headers: {
                'Authorization': 'Basic ' + btoa(`${apiConfig.auth.username}:${apiConfig.auth.password}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            expect(response.status).to.eq(200); // Check if the response was successful
            token = response.body.access_token; // Save the access token
        });
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

    });

    it('should edit all fields in the task edit screen ', () => {

        const taskData = {
            title: 'Task Maif Insert to be edited',
            description: 'Description Maif Insert for Task to be edited',
            dueDate: '2024-08-06',
            completed: true
        };

        // Insert a new task and get the ID of the inserted record
        cy.insertTaskAndReturnId(taskData.title, taskData.description, taskData.dueDate, taskData.completed).then((insertedId) => {
            expect(insertedId).to.exist;

            // Visit the task edit page for the inserted task
            cy.visit(`/app/task/${insertedId}`);

            // Edit operations here...
            taskFormPage.enterTitle('Task Maif Updated Title for Task');
            taskFormPage.enterDescription('Task Maif Updated Description for Task');
            taskFormPage.selectCompleted(true);
            taskFormPage.enterDueDate('2024-08-07');


            taskFormPage.clickLabelPageTitle();

            // Save the changes
            taskFormPage.clickSaveButton();
            taskFormPage.clickBackSearchButton();

            // Verifying the task is updated
            taskSearchPage.enterDescription('Task Maif Updated Description for Task');
            taskSearchPage.clickConsultRecordsButton();
            taskSearchPage.getTaskRows().should('contain', "Task Maif Updated Description for Task");

        });

        const titlePattern = 'Task Maif%'; // Pattern of the title you want to delete

        cy.deleteTasksByTitleLike(titlePattern).then((result) => {
            expect(result).to.have.property('affectedRows').and.to.be.at.least(0); // Ensure no errors even if no records are deleted
        });


    });


    it('should display all required field error messages', () => {

        // Array with the expected error messages
        const expectedErrorMessages = [
            "Task is required",
            "Description is required",
            "Due Date is required"
        ];

        const taskData = {
            title: 'Task Maif Insert to be edited',
            description: 'Description Maif Insert for Task to be edited',
            dueDate: '2024-08-06',
            completed: true
        };

        // Insert a new task and get the ID of the inserted record
        cy.insertTaskAndReturnId(taskData.title, taskData.description, taskData.dueDate, taskData.completed).then((insertedId) => {
            expect(insertedId).to.exist;

            // Visit the task edit page for the inserted task
            cy.visit(`/app/task/${insertedId}`);

            // Clear all fields
            taskFormPage.clearTitle();
            taskFormPage.clearDescription();
            taskFormPage.selectCompleted();
            taskFormPage.clearDueDate();

            // Trigger validation
            taskFormPage.clickLabelPageTitle();

            // Capture all error messages and verify if they are on the page
            cy.get('.fas.fa-exclamation-circle').parent().each(($el, index) => {
                cy.wrap($el).invoke('text').then((text) => {
                    // Check if the error message text is in the list of expected messages
                    expect(expectedErrorMessages).to.include(text.trim());
                });
            });

            // Verify if the number of error messages on the page matches the number of expected messages
            cy.get('.fas.fa-exclamation-circle').parent().should('have.length', expectedErrorMessages.length);

            // Verify that the save button is disabled
            taskFormPage.verifySaveButtonDisabled();
        });

        const titlePattern = 'Task Maif%'; // Pattern of the title you want to delete

        cy.deleteTasksByTitleLike(titlePattern).then((result) => {
            expect(result).to.have.property('affectedRows').and.to.be.at.least(0); // Ensure no errors even if no records are deleted
        });
    });




});
