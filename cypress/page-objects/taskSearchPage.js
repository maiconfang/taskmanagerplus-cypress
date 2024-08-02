// TaskSearchPage.js
import 'cypress-xpath'; // Import the cypress-xpath library
import 'cypress-real-events/support';

class TaskSearchPage {

    enterTitle(title) {
        cy.get('#task-search-title').type(title); // Type the task title
    }

    enterDescription(description) {
        cy.get('#task-search-description').type(description); // Type the task description
    }

    enterDueDate(dueDate) {
        cy.get('#task-search-due-date').type(dueDate); // Type the task due date
    }

    selectCompleted() {
        cy.get('#task-search-completed').check(); // Select the task completed status
    }

    selectNotCompleted() {
        cy.get('#task-search-not-completed').check(); // Select the task not completed status
    }

    clickConsultRecordsButton() {
        cy.get('#task-search-btn-consult-records').click(); // Click the Consult Records button
    }

    clickPageNextButton() {
        cy.get('#pagination-next-active').click(); // Click the Next button on the pagination
    }

    getTaskRows() {
        return cy.get('tbody tr');
    }

    clickDeleteButton() {
        cy.get('#task-search-action-remove-task').click(); // Click the Delete button
    }

    clickDialogYesButton() {
        cy.get('#dialog-confirmation-yes').click(); // Click the Yes button on the dialog
    }

    captureSuccessMessage() {
        return cy.get('div[role="alert"][aria-label="Successfully Removed"]');
    }

}

export default TaskSearchPage;
