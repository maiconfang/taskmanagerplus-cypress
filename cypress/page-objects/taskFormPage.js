class TaskFormPage {

    getTitlePageTaskForm() {
        return cy.get('#task-register-page-title');
    }

    enterTitle(title) {
        cy.get('#task-register-title').clear().type(title);
    }

    clickLabelPageTitle() {
        cy.get('#task-register-title').click();
    }

    clearTitle() {
        cy.get('#task-register-title').clear();
    }

    enterDescription(description) {
        cy.get('#task-register-description').clear().type(description);
    }

    clearDescription() {
        cy.get('#task-register-description').clear();
    }

   enterDueDate(dueDate) {
        cy.get('#task-register-duedate').clear().type(dueDate);
    }

    clearDueDate() {
        cy.get('#task-register-due-date').clear();
    }

    selectCompleted() {
        cy.get('#task-register-completed').click();
    }

    clickSaveButton() {
        cy.get('#task-register-btn-save-task').click();
    }

    clickBackSearchButton() {
        cy.get('#task-register-btn-back').click();
    }

    
}

export default TaskFormPage;
