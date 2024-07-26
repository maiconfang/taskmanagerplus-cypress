const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Replace with your application's URL
    specPattern: 'cypress/integration/**/*.spec.js', // Ensures all .spec.js tests in the integration directory are detected
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
  },
});
