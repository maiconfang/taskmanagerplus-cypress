// cypress/support/commands.js

import 'cypress-axe';
const createConnection  = require('./db');

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#loginButton').click();
});

Cypress.Commands.add('checkFrontend', () => {
  const frontendUrl = Cypress.config('baseUrl');
  
  cy.request({
    url: frontendUrl,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Frontend is not accessible');
    }
  });
});

Cypress.Commands.add('checkBackend', () => {
  const apiConfig = Cypress.env('apiConfig');
  const { url, auth, body } = apiConfig;

  cy.request({
    method: 'POST',
    url: url,
    headers: {
      'Authorization': 'Basic ' + btoa(`${auth.username}:${auth.password}`), // Basic Auth
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Backend is not accessible');
    }
  });
});

Cypress.Commands.add('insertTask', (task, token) => {
  const apiConfig = Cypress.env('apiConfig');
  cy.request({
      method: 'POST',
      url: apiConfig.urlTask,
      body: task,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  }).then(response => {
      expect(response.status).to.eq(201); // Check if the record was created successfully
      return response.body.id; // Return the record ID
  });
});


Cypress.Commands.add('insertTaskIfNotExists', (task, token) => {
  const apiConfig = Cypress.env('apiConfig');
  
  // Check if the task already exists before inserting it
  cy.request({
      method: 'GET',
      url: `${apiConfig.urlTask}?description=${task.description}`,
      headers: {
          'Authorization': `Bearer ${token}`
      }
  }).then(response => {
      const tasks = response.body._embedded ? response.body._embedded.tasks : [];
      const existingTask = tasks.find(t => t.title === task.title && t.description === task.description);

      if (!existingTask) {
          cy.request({
              method: 'POST',
              url: apiConfig.urlTask,
              body: task,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          }).then(response => {
              expect(response.status).to.eq(201); // Check if the record was created successfully
              return response.body.id; // Return the record ID
          });
      } else {
          return existingTask.id; // Return the existing record ID
      }
  });
});

Cypress.Commands.add('deleteTaskById', (taskId, token) => {
  const apiConfig = Cypress.env('apiConfig');
  cy.request({
      method: 'DELETE',
      url: `${apiConfig.urlTask}/${taskId}`,
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  }).then(response => {
      expect(response.status).to.eq(204); // Check if the task was deleted successfully
  });
});



// Custom command to insert a task
Cypress.Commands.add('insertTaskByDataBase', (title, description, dueDate, completed) => {
  return cy.task('queryDb', `
    INSERT INTO task (title, description, due_date, completed)
    VALUES ('${title}', '${description}', '${dueDate}', ${completed});
  `);
});

// Custom command to delete tasks based on a title pattern
Cypress.Commands.add('deleteTasksByTitleLike', (titlePattern) => {
  const query = `DELETE FROM task WHERE title LIKE '${titlePattern}'`;
  return cy.task('queryDb', query);
});

// Command to query the database
Cypress.Commands.add('queryDb', (query) => {
  return cy.task('queryDb', query);
});