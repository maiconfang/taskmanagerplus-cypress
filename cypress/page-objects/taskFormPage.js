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

    clickDueDate() {
        cy.get('#task-register-duedate').click();
    }

    clearDueDate() {
        cy.get('#task-register-duedate').clear();
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


    // Method to verify if the save button is disabled
    verifySaveButtonDisabled() {
        cy.get('#task-register-btn-save-task').should('be.disabled');
    }

    // Method to capture all error messages and verify if they match the expected messages
    verifyErrorMessages(expectedErrorMessages) {
        cy.get('.fas.fa-exclamation-circle').parent().each(($el, index) => {
            cy.wrap($el).invoke('text').then((text) => {
                expect(expectedErrorMessages).to.include(text.trim());
            });
        });

        // Verify if the number of error messages on the page matches the number of expected messages
        cy.get('.fas.fa-exclamation-circle').parent().should('have.length', expectedErrorMessages.length);
    }


}

export default TaskFormPage;
