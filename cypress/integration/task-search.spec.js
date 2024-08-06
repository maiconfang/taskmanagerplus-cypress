// cypress/integration/task-search.spec.js
// import TaskSearchPage from '../../support/TaskSearchPage';
import TaskSearchPage from '../page-objects/TaskSearchPage';
import LoginPage from '../page-objects/loginPage';
import TaskFormPage from '../page-objects/taskFormPage';
import DashboardPage from '../page-objects/dashboardPage';
import 'cypress-real-events/support';
import axios from 'axios';


describe('Task Search Page', () => {
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

    it('should delete the record Description for Task deleted when clicking the delete button and selecting yes', () => {
        cy.fixture('tasks').then((tasks) => {
            const task = tasks.deleteTask;
            cy.insertTaskIfNotExists(task, token).then(recordId => {
                cy.wrap(recordId).as('recordId'); // Save the record ID for later use

                // Search and delete the task through the UI
                taskSearchPage.enterDescription(task.description);
                taskSearchPage.clickConsultRecordsButton();
                taskSearchPage.getTaskRows().should('contain', task.description);

                taskSearchPage.clickDeleteButton();
                taskSearchPage.clickDialogYesButton();

                // Verify the success message
                taskSearchPage.captureSuccessMessage().should('contain', 'Successfully Removed');
            });
        });
    });

    it.skip('should insert a new task', () => {
        const taskData = {
            title: 'Task Maif Insert to be',
            description: 'Description Maif Insert for Task to be',
            dueDate: '2024-08-06',
            completed: true
        };

        cy.insertTaskByDataBase(taskData.title, taskData.description, taskData.dueDate, taskData.completed).then((result) => {
            expect(result.affectedRows).to.equal(1);
        });
    });


    it.skip('should delete tasks by title pattern', () => {
        const titlePattern = 'Task Maif%'; // Pattern of the title you want to delete

        cy.deleteTasksByTitleLike(titlePattern).then((result) => {
            expect(result).to.have.property('affectedRows').and.to.be.greaterThan(0);
        });
    });

    it.only('should edit the record Description for Task to be edited', () => {
        const updatedTaskDescription = 'Task Maif Updated Description for Task';

        const titlePattern = 'Task Maif%'; // Pattern of the title you want to delete

        cy.deleteTasksByTitleLike(titlePattern).then((result) => {
            expect(result).to.have.property('affectedRows').and.to.be.at.least(0); // Ensure no errors even if no records are deleted
        });

        const taskData = {
            title: 'Task Maif Insert to be',
            description: 'Description Maif Insert for Task to be',
            dueDate: '2024-08-06',
            completed: true
        };

        cy.insertTaskByDataBase(taskData.title, taskData.description, taskData.dueDate, taskData.completed).then((result) => {
            expect(result.affectedRows).to.equal(1);
        });

        // Search and edit the task through the UI
        taskSearchPage.enterDescription(taskData.description);
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', taskData.description);

        taskSearchPage.clickEditButton();

        // Verify the presence of the task form
        taskFormPage.getTitlePageTaskForm().should('contain', 'Edit of Task');

        // Edit operations here...
        taskFormPage.enterTitle('Task Maif Updated Title for Task');
        taskFormPage.enterDescription(updatedTaskDescription);
        taskFormPage.selectCompleted(true);
        taskFormPage.enterDueDate('2024-07-22');


        taskFormPage.clickLabelPageTitle();

        // Save the changes
        taskFormPage.clickSaveButton();
        taskFormPage.clickBackSearchButton();

        // Verifying the task is updated
        taskSearchPage.enterDescription(updatedTaskDescription);
        taskSearchPage.clickConsultRecordsButton();
        taskSearchPage.getTaskRows().should('contain', updatedTaskDescription);

    });


});
