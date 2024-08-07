// cypress/integration/task-search.spec.js
import TaskSearchPage from '../page-objects/TaskSearchPage';
import LoginPage from '../page-objects/loginPage';
import TaskFormPage from '../page-objects/taskFormPage';
import DashboardPage from '../page-objects/dashboardPage';
import 'cypress-real-events/support';
import { it } from 'mocha';


describe('Task Insert Page', () => {
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

    it('should display minimum character length error messages when fields are filled with less than required characters', () => {

        cy.visit('/app/task'); // Navigate to the task search page before each test
        // Click on the "Create Record" button
        taskSearchPage.clickCreateRecordButton();

        // Verify the presence of the task form
        taskFormPage.getTitlePageTaskForm().should('contain', 'New Task');


        // Array with the expected error messages
        const expectedErrorMessages = [
            "Task needs to have at least 2 characters",
            "Description needs to have at least 2 characters",
            "Due Date is required"
        ];

        taskFormPage.enterTitle('1');
        taskFormPage.enterDescription(1);
        taskFormPage.selectCompleted(true);
        taskFormPage.clickDueDate();

        taskFormPage.clickLabelPageTitle();

        // Verify error messages using the new method
        taskFormPage.verifyErrorMessages(expectedErrorMessages);

        // Verify that the save button is disabled
        taskFormPage.verifySaveButtonDisabled();

    });



    it('should display maximum character length error messages when fields are filled with more than the required characters', () => {
        cy.fixture('tasks').then((tasks) => {
            const maxCharactersTask = tasks.maxCharactersInsertTask;

            cy.visit('/app/task'); // Navigate to the task search page before each test

            // Click on the "Create Record" button
            taskSearchPage.clickCreateRecordButton();

            // Verify the presence of the task form
            taskFormPage.getTitlePageTaskForm().should('contain', 'New Task');

            // Array with the expected error messages
            const expectedErrorMessages = [
                "Task may have at most 255 characters",
                "Description may have at most 2000 characters",
                "Due Date is required"
            ];

            // Fill fields with values from the fixture
            taskFormPage.enterTitle(maxCharactersTask.title);
            taskFormPage.enterDescription(maxCharactersTask.description);
            taskFormPage.selectCompleted(true);
            taskFormPage.clickDueDate();

            taskFormPage.clickLabelPageTitle();

            // Verify error messages using the new method
            taskFormPage.verifyErrorMessages(expectedErrorMessages);

            // Verify that the save button is disabled
            taskFormPage.verifySaveButtonDisabled();
        });
    });







});
