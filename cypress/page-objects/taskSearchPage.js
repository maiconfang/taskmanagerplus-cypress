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


    getTaskRows() {
        return cy.get('tbody tr');
    }


}

export default TaskSearchPage;
